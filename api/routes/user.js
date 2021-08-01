const regex = require("../utils/regex")
const {password, pseudo} = regex
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const escapeHTML = require("escape-html")
const tokenGenerator = require("../utils/tokenGenerator")

module.exports = (db) => {
	const route = require("express").Router()

	route.post("/register",async (req,res)=>{
		const body = req.body
		if (!body.pseudo || !body.password){ //check if required fields are presents (pseudo and password)
			return res.status(422).json({
				error:"required fileds",
				code:"EMPTY_FIELDS",
				errorMessage:"This post route require a pseudo and a password field"
			})
		}

		if (!pseudo.test(body.pseudo)){ //test is pseudo is valid with regex
			return res.status(422).json({
				error: "invalid field",
				code: "INVALID_FIELD_PSEUDO",
				errorMessage: "The pseudo field lenght must be between 3 and 15 char long and can't contain <>\"_'=;()\/\\"
			})
		}

		//escape pseudo spetial char
		body.pseudo = escapeHTML(body.pseudo)

		if (!password.test(body.password)) { //test is password is valid with regex
			return res.status(422).json({
				error: "invalid field",
				code: "INVALID_FIELD_PASSWORD",
				errorMessage: "The password field lenght must be minimu 8 char long and must contain at least on lower case letter, one upper case letter, one number and ont spetial char: *.!@$%^&(){}[]:;<>,.?\/~_+-=|"
			})
		}

		//hash password
		const hashPassword = await bcrypt.hash(body.password, parseInt(process.env.BCRYPT_SALT_ROUND) ?? 10)
		
		//query database
		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("INSERT INTO users (pseudo,password) VALUES (?,?)", [body.pseudo, hashPassword])
			if (result.affectedRows == 1){
				return res.json({ //response if everithing is ok
					error:null,
					insertId: result.insertId
				})
			}
		} catch (err){
			if (err.code == "ER_DUP_ENTRY"){ //if pseudo alrealy exist
				return res.status(409).json({
					error:"Pseudo alrealy exist",
					code:"PSEUDO_EXIST"
				})
			}

			//for all others errors
			console.log(err)
			return res.status(500).json({
				error:"Internal error"
			})
		} finally {
			if (conn) //always release connection after using it
				conn.release()
		}
	})

	route.post("/login",async (req, res) => {
		const body = req.body
		if (!body.pseudo || !body.password) { //check if required fields are presents
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
		}

		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("SELECT id, pseudo, image, password FROM users WHERE pseudo=?",[body.pseudo])
			
			//check if user exist
			if (result.length == 0){
				return res.status(401).json({
					error:"User doesn't exist",
					code:"USER_NOT_EXIST"
				})
			}
			const user = result[0]
			//check password
			const validPassword = await bcrypt.compare(body.password, user.password)
			if (!validPassword){
				return res.status(401).json({
					error: "Invalid password",
					code: "WRONG_PASSWORD"
				})
			}

			//create jwt
			const tokens = tokenGenerator(user.id, req.ip)

			//update bdd refresh token
			conn.query("UPDATE users SET refreshToken=? WHERE id=?",[tokens.refreshToken,user.id])

			//set cookie
			res.cookie("refreshToken", tokens.refreshToken, res.cookieSettings)

			//send it
			return res.json({
				error:null,
				token: tokens.accessToken,
				pseudo:user.pseudo,
				image: user.image
			})
		} catch (err) {
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code:"INTERNAL"
			})
		} finally {
			if (conn)
				conn.release()
		}
	})

	route.post("/userExist",async (req,res) => {
		const body = req.body
		if(!body.pseudo) { //check if required fields are presents
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
		}

		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("SELECT id, image, password FROM users WHERE pseudo=?", [body.pseudo])

			//check if user exist
			return res.json({
				err:null,
				userExist:result.length !== 0
			})

		} catch (err) {
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		} finally {
			if (conn)
				conn.release()
		}
	})

	route.post("/refresh",async (req,res)=>{
		let refreshToken = req.cookies.refreshToken
		if (!refreshToken){
			return res.status(401).json({
				error:"No refresh token provided",
				errorCode:"NO_REFRESH_TOKEN"
			})
		}

		try { 
			jwt.verify(refreshToken,process.env.TOKEN_SECRET)
		} catch (err) {
			if (err.name == "JsonWebTokenError"){
				return res.status(401).json({
					error: "Refresh token is invalid",
					errorCode: "INVALID_REFRESH_TOKEN"
				})
			} 
			
			if (err.name == "TokenExpiredError") {
				return res.status(401).json({
					error: "Refresh token is expired",
					errorCode: "EXPIRED_REFRESH_TOKEN"
				})
			}

			console.log(err) //log error only if it's unknown
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		const token = jwt.decode(refreshToken)

		let conn, result
		try {
			conn = await db.getConnection()
			result = await conn.query("SELECT id FROM users WHERE id = ?",[token.id])
			if (result.length == 0){
				return res.status(401).json({
					error: "This token disignate an user but it is not the user's token",
					errorCode: "WRONG_REFRESH_TOKEN_OWNER"
				})
			}
		} catch(err){
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		} finally {
			if (conn)
				conn.release()
		}

		const accessToken = tokenGenerator.accessToken(result[0].id, req.ip)

		res.json({
			error:null,
			token:accessToken
		})
	})

	route.post("/logout",require("../middleware/token"),async (req,res)=>{
		const token = req.token
		let conn
		try {
			//update db
			conn = await db.getConnection()
			await conn.query("UPDATE users SET refreshToken='' WHERE id=?",[token.id])

			//set cookie
			res.cookie("refreshToken", "", res.cookieSettings)
		} catch(err){
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		} finally {
			if (conn)
				conn.release()
		}

		return res.json({
			error:null
		})
	})

	return route
}