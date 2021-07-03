const express = require("express")
const app = express()

const helmet = require("helmet")
app.use(helmet())

const bodyparser = require("body-parser")
app.use(bodyparser.json())

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
		author:"Robotechnic"
	})
})

app.use("/user",require("./routes/user")(db))

module.exports = app

if (require.main === module) {
	const port = process.env.PORT || 3000
	app.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`API server listening on port ${port}`)
	})
}