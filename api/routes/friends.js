const tokenChecker = require("../middleware/token")
const dbQuery = require("../utils/dbQuery.js")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/userFriends", tokenChecker, async (req, res) => {
		const userId = req.token.id

		const { result, err } = await dbQuery(
			db,
			"SELECT u.id AS id, pseudo FROM users AS u  LEFT JOIN friends AS f1 ON f1.userId1=u.id LEFT JOIN friends AS f2 ON f2.userId2=u.id  WHERE  (f1.userId2 = ? OR f2.userId1 = ?)",
			[userId, userId]
		)

		if (err) {
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
		console.log(result)
		res.json(result)
	})

	router.post("/hasFriend", tokenChecker, async (req, res) => {
		const body = req.body

		if (!body.friendId) {
			return res.status(422).json({
				error: "required fileds",
				code: "EMPTY_FIELDS",
				errorMessage: "This post route require a friendId field"
			})
		}

		const userId = req.token.id
		const { result, err } = await dbQuery(
			db,
			"SELECT u.id AS id, pseudo FROM users AS u LEFT JOIN friends AS f1 ON f1.userId1=u.id LEFT JOIN friends AS f2 ON f2.userId2=u.id  WHERE  (f1.userId2 = ? AND f1.userId1=?) OR (f2.userId2 = ? AND f2.userId1=?)",
			[userId, body.friendId, body.friendId, userId]
		)

		if (err) {
			console.log("error")
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
		console.log(result)
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