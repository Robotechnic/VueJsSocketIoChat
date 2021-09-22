const regex = require("../utils/regex")
const { password, pseudo } = regex
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const escapeHTML = require("escape-html")
const tokenGenerator = require("../utils/tokenGenerator")
const dbQuery = require("../utils/dbQuery.js")

module.exports = (db) => {
	const route = require("express").Router()

	route.post("/signup", async (req, res) => {
		const body = req.body
		if (!body.pseudo || !body.password) { //check if required fields are presents (pseudo and password)
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
		}

		if (!pseudo.test(body.pseudo)) { //test is pseudo is valid with regex
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

		const { result, err } = await dbQuery(
			db,
			"SELECT id,pseudo FROM users WHERE id IN (SELECT friendId FROM friends WHERE userId=?)",
			[body.pseudo, hashPassword]
		)

		if (result.affectedRows == 1) {
			return res.json({ //response if everithing is ok
				error: null,
				insertId: result.insertId
			})
		}

		if (err.code == "ER_DUP_ENTRY") { //if pseudo alrealy exist
			return res.status(409).json({
				error: "Pseudo alrealy exist",
				code: "PSEUDO_EXIST"
			})
		}

		//for all others errors
		console.log(err)
		return res.status(500).json({
			error: "Internal error",
			code: "INTERNAL"
		})
	})

	route.post("/signin", async (req, res) => {
		const body = req.body
		if (!body.pseudo || !body.password) { //check if required fields are presents
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
		}

		let query = await dbQuery(
			db,
			"SELECT id, pseudo, password FROM users WHERE pseudo=?",
			[body.pseudo]
		)
		
		let err = query.err
		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		let result = query.result
		if (result.length == 0) {
			return res.status(401).json({
				error: "User doesn't exist",
				code: "USER_NOT_EXIST"
			})
		}

		const user = result[0]
		//check password
		const validPassword = await bcrypt.compare(body.password, user.password)
		if (!validPassword) {
			return res.status(401).json({
				error: "Invalid password",
				code: "WRONG_PASSWORD"
			})
		}

		//create jwt
		const tokens = tokenGenerator(user.id, req.ip)

		
		//update bdd refresh token
		query = await dbQuery(
			db,
			"UPDATE users SET refreshToken=? WHERE id=?",
			[tokens.refreshToken, user.id]
		)

		err = query.err
		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		result = query.result

		//set cookie
		res.cookie("refreshToken", tokens.refreshToken, res.cookieSettings)

		//send it
		return res.json({
			error: null,
			token: tokens.accessToken[0],
			pseudo: user.pseudo,
			id: user.id,
			expirein: tokens.accessToken[1]
		})
	})

	route.post("/userExist", async (req, res) => {
		const body = req.body
		if (!body.pseudo) { //check if required fields are presents
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a pseudo and a password field"
			})
		}

		const { result, err } = await dbQuery(
			db,
			"SELECT id, password FROM users WHERE pseudo=?",
			[body.pseudo]
		)

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		return res.json({
			err: null,
			userExist: result.length !== 0
		})
	})

	route.post("/refresh", async (req, res) => {
		let refreshToken = req.cookies.refreshToken
		if (!refreshToken) {
			return res.status(401).json({
				error: "No refresh token provided",
				errorCode: "NO_REFRESH_TOKEN"
			})
		}

		try {
			jwt.verify(refreshToken, process.env.TOKEN_SECRET)
		} catch (err) {
			if (err.name == "JsonWebTokenError") {
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

		const { result, err } = await dbQuery(
			db,
			"SELECT id,pseudo FROM users WHERE id = ?",
			[token.id]
		)

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		if (result.length == 0) {
			return res.status(401).json({
				error: "This token disignate an user but it is not the owner of it",
				errorCode: "WRONG_REFRESH_TOKEN_OWNER"
			})
		}

		const [accessToken, expirein] = tokenGenerator.accessToken(result[0].id, req.ip)

		res.json({
			error: null,
			token: accessToken,
			expirein,
			pseudo: result[0].pseudo,
			id: result[0].id
		})
	})

	route.post("/logout", require("../middleware/token"), async (req, res) => {
		const { result, err } = await dbQuery(
			db,
			"UPDATE users SET refreshToken='' WHERE id=?",
			[token.id]
		)

		//set cookie
		res.cookie("refreshToken", "", res.cookieSettings)
		
		if (err){
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		return res.json({
			error: null
		})
	})

	return route
}