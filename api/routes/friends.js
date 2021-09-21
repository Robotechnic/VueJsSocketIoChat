const tokenChecker = require("../middleware/token")

module.exports = (db) => {
	const router = require("express").Router()

	router.post("/userFriends",tokenChecker,async (req,res)=>{
		const userId = req.token.id

		let conn
		try {
			conn = await db.getConnection()

			const result = await conn.query("SELECT id,pseudo FROM users WHERE id IN (SELECT friendId FROM friends WHERE userId=?)",[userId])

			if (result.length === 0) {
				return res.status(401).json({
					error: "User doesn't exist",
					code: "USER_NOT_EXIST"
				})
			}
			res.json(result)
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


	return router
}