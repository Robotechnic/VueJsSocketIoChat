const tokenChecker = require("../middleware/token")
const friendQuery = require("../utils/friendQuery")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/userFriends", tokenChecker, async (req, res) => {
		const userId = req.token.id

		const {result,err} = await friendQuery.userFriends(db,userId)

		if (err) {
			console.log(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
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
		const { result, err } = await friendQuery.hasFriend(db,userId,body.friendId)

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}
		
		if (result.length === 0)
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