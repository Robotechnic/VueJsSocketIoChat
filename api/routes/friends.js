const tokenChecker = require("../middleware/token")
const dbQuery = require("../utils/dbQuery.js")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/userFriends",tokenChecker,async (req,res)=>{
		const userId = req.token.id

		const {result,err} = await dbQuery(db,"SELECT id,pseudo FROM users WHERE id IN (SELECT friendId FROM friends WHERE userId=?)",[userId])

		if (err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})

		res.json(result)
	})

	router.post("/hasFriend",tokenChecker,async (req,res)=>{
		const body = req.body

		if (!body.friendId) {
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a friendId field"
			})
		}

		const userId = req.token.id
		const { result, err } = await dbQuery(db, "SELECT id,pseudo FROM users WHERE id = (SELECT friendId FROM friends WHERE userId=? AND friendId=?)", [userId,body.friendId])

		if (err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})

		if (result.length == 0)
			return res.json({
				hasFriend: false,
				friend: {}
			})
		
		res.json({
			hasFriend: true,
			friend: result[0]
		})
	})


	return router
}