const express = require("express")
const app = express()

require("dotenv").config({
	path: __dirname +"/.env"
})

const helmet = require("helmet")
app.use(helmet())

const bodyparser = require("body-parser")
app.use((req, res, next)=>{
	bodyparser.json()(req,res,(err)=>{
		if (err?.status == 400){
			res.status(400).json({
				error:"invalid json",
				errorCode:"INVALID_JSON",
				message:err.message,
				body:err.body
			})
			return
		}
		next()
	})
})

const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use((req,res,next)=>{
	res.cookieSettings = {
		httpOnly: true,
		sameSite: true,
		secure: process.env.production ?? false
	}
	next()
})

if (process.env.ORIGIN){
	const cors = require("cors")
	app.use(cors({
		origin: process.env.ORIGIN
	}))
}

const mariadb = require("mariadb")
const db = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: 5
})

app.get("/",(req,res)=>{
	res.json({
		apiVersion:1.0,
		author:"Robotechnic",
		errorCodes: {
			"INTERNAL": "Some internal error appened",
			"EMPTY_FIELDS":"The request require some field which are not provided",
			"INVALID_FIELD_FIELDNAME":"The content of FIELDNAME is not valid",
			"PSEUDO_EXIST":"Provided pseudo alrealy exist",
			"USER_NOT_EXIST":"Selected user doesn't exist",
			"WRONG_PASSWORD":"Password is wrong",
			
			"NO_REFRESH_TOKEN":"There is no refresh token in cookie",
			"INVALID_REFRESH_TOKEN":"The refresh token has invalid signature",
			"EXPIRED_REFRESH_TOKEN":"The refresh token is expired",

			"INVALID_TOKEN":"Current access token is invalid",
			"EXPIRED_TOKEN":"Current token is outdated",
			"INVALID_TOKEN_IP":"Ip stored in token is different than ip provided by user"
		}
	})
})

app.use("/friends", require("./routes/friends")(db))
app.use("/user", require("./routes/user")(db))

module.exports = app

if (require.main === module) {
	const port = process.env.PORT || 3000
	app.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`API server listening on port ${port}`)
	})
}