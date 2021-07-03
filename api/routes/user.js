

module.exports = (db) => {
	const route = require("express").Router()

	route.post("/login",async (req,res)=>{
		



		res.json({
			error:"Not implemented"
		})
	})

	route.post("/signin", (req, res) => {
		res.json({
			error: "Not implemented"
		})
	})

	return route
}