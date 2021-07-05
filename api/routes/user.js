const regex = require("../utils/regex")
const {password, pseudo} = regex
const bcrypt = require("bcrypt")
const tokenGenerator = require("../utils/tokenGenerator")

module.exports = (db) => {
	const route = require("express").Router()

	route.post("/login",async (req,res)=>{
		const body = req.body
		if (!body.pseudo || !body.password){ //check if required fields are presents (pseudo and password)
			res.status(422).json({
				error:"required fileds",
				code:"EMPTY_FIELDS",
				errorMessage:"This post route require a pseudo and a password field"
			})
			return
		}

		if (!pseudo.test(body.pseudo)){ //test is pseudo is valid with regex
			res.status(422).json({
				error: "invalid field",
				code: "INVALID_FIELD_PSEUDO",
				errorMessage: "The pseudo field lenght must be between 3 and 15 char long and can't contain <>\"_'=;()\/\\"
			})
			return
		}

		if (!password.test(body.password)) { //test is password is valid with regex
			res.status(422).json({
				error: "invalid field",
				code: "INVALID_FIELD_PASSWORD",
				errorMessage: "The password field lenght must be minimu 8 char long and must contain at least on lower case letter, one upper case letter, one number and ont spetial char: *.!@$%^&(){}[]:;<>,.?\/~_+-=|"
			})
			return
		}

		//hash password
		const hashPassword = await bcrypt.hash(body.password, parseInt(process.env.BCRYPT_SALT_ROUND) ?? 10)
		
		//query database
		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("INSERT INTO users (pseudo,password) VALUES (?,?)", [body.pseudo, hashPassword])
			if (result.affectedRows == 1){
				res.json({ //response if everithing is ok
					error:null,
					insertId: result.insertId
				})
			}
		} catch (err){
			if (err.code == "ER_DUP_ENTRY"){ //if pseudo alrealy exist
				res.status(409).json({
					error:"Pseudo alrealy exist",
					code:"PSEUDO_EXIST"
				})
				return
			}

			//for all others errors
			console.log(err)
			res.status(500).json({
				error:"Internal error"
			})
			return
		} finally {
			if (conn) //always release connection after using it
				conn.release()
		}
	})

	route.post("/signin",async (req, res) => {
		const body = req.body
		if (!body.pseudo || !body.password) { //check if required fields are presents
			res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
			return
		}

		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("SELECT id, password FROM users WHERE pseudo=?",[body.pseudo])
			
			//check if user exist
			if (result.length == 0){
				res.status(401).json({
					error:"User doesn't exist",
					code:"USER_NOT_EXIST"
				})
				return
			}
			const user = result[0]
			//check password
			const validPassword = await bcrypt.compare(body.password, user.password)
			if (!validPassword){
				res.status(401).json({
					error: "Invalid password",
					code: "INVALID_PASSWORD"
				})
				return
			}

			//create jwt
			const tokens = tokenGenerator(user.id, req.ip)

			//update bdd refresh token
			conn.query("UPDATE users SET refreshToken=? WHERE id=?",[tokens.refreshToken,user.id])

			//set cookie
			req.cookie("refreshToken",tokens.refreshToken)

			//send it
			res.json({
				error:null,
				token: tokens.accessToken
			})
		} catch (err) {
			console.log(err)
			res.status(500).json({
				error: "Internal error",
				code:"INTERNAL"
			})
			return
		} finally {
			if (conn)
				conn.release()
		}
	})

	route.post("/userExist",async (req,res) => {
		const body = req.body
		if(!body.pseudo) { //check if required fields are presents
			res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
			return
		}

		let conn
		try {
			conn = await db.getConnection()
			const result = await conn.query("SELECT id, image, password FROM users WHERE pseudo=?", [body.pseudo])

			//check if user exist
			res.json({
				err:null,
				userExist:result.length !== 0
			})

		} catch (err) {
			console.log(err)
			res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
			return
		} finally {
			if (conn)
				conn.release()
		}
	})

	return route
}