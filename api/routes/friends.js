const tokenChecker = require("../middleware/token")
const friendQuery = require("../utils/friendQuery")
const fields = require("../middleware/requiredFields")
const io = require("socket.io-client")

module.exports = (db) => {
	const router = require("express").Router()
	router.socket = io(`${process.env.HOST}:${process.env.WEBCOCKET_PORT}`,{
		auth: {
			token: router.socketAuthToken
		}
	})

	router.post("/userFriends", tokenChecker, async (req, res) => {

		const { result, err } = await friendQuery.userFriends(db, req.token.id)

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json(result)
	})

	router.post("/hasFriend", tokenChecker, fields(["friendId"]), async (req, res) => {
		const body = req.body
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

	router.post("/search", tokenChecker, fields(["pseudo"]), async (req,res)=>{
		const body = req.body
		const relations = await friendQuery.allFriendsRelations(db, req.token.id)
		if (relations.err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		const excludedIds = []
		relations.result.forEach((element)=>{
			excludedIds.push(element.userId)
		})

	
		const { result, err } = await friendQuery.searchFriend(db, req.token.id, body.pseudo, [1])

		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json(result)
	})

	router.post("/sendrequest", tokenChecker, fields(["userId"]), async (req,res)=>{
		let { result, err } = await friendQuery.hasFriend(db, req.token.id, req.body.userId)
		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		if (result.length > 0) {
			return res.status(409).json({
				error: "This is alrealy your friend",
				code: "ALREALY_FRIEND"
			})
		}


		({ result, err } = await friendQuery.addFriendRequest(db, req.token.id, req.body.userId))


		if (err || result.affectedRows < 1) {
			if (err.code === "ER_DUP_ENTRY") {
				return res.status(409).json({
					error: "Duplicate friend request",
					code: "DUPLICATE_FRIEND_REQUEST"
				})
			}
			
			if (err.code === "ER_CONSTRAINT_FAILED") {
				return res.status(406).json({
					error: "User can't be friend with himself",
					code: "USER_AUTO_FRIEND"
				})
			}
			
			console.error(err)
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}


		return res.json({
			error: null,
			code: null
		})
	})

	router.post("/getRequests", tokenChecker, async(req,res)=>{
		const {result, err} = await friendQuery.getFriendRequest(db, req.token.id)
		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json(result)
	})

	router.post("/getDemands", tokenChecker, async (req, res) => {
		const { result, err } = await friendQuery.getFriendDemands(db, req.token.id)
		if (err) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json(result)
	})

	router.post("/cancelRequest", tokenChecker, fields(["requestId"]), async (req, res)=>{
		const { result, err } = await friendQuery.cancelFriendRequest(db, req.body.requestId)
		if (err && result.affectedRows >= 1) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json({})
	})

	router.post("/acceptRequest", tokenChecker, fields(["requestId"]), async (req, res) => {
		const { result, err } = await friendQuery.acceptFriendRequest(db, req.body.requestId)
		if (err && result.affectedRows >= 1) {
			return res.status(500).json({
				error: "Internal error",
				code: "INTERNAL"
			})
		}

		res.json({})
	})

	return router
}