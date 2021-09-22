const tokenChecker = require("../middleware/token")
const dbQuery = require("../utils/dbQuery.js")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/lastMessages", tokenChecker, async (req,res)=>{
		const body = req.body

		if (!body.friendId) {
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a friendId field"
			})
		}

		body.friendId = Number(body.friendId)

		const { result, err } = await dbQuery(
			db, 
			"SELECT id,userId,message,creation FROM messages WHERE (userId=? AND friendId=?) OR (userId=? AND friendId=?) ORDER BY creation ASC LIMIT 20",
			[req.token.id, body.friendId, body.friendId, req.token.id]
		)

		if (err){
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
		
		res.json({
			totalMessages: result?.length ?? 0,
			messages: result ?? []
		})
	})

	return router
}