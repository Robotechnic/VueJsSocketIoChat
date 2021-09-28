const { Server } = require("socket.io")
const tokenChecker = require("./middlewares/token");

const friendQuery = require("../api/utils/friendQuery")


export default function () {
	this.nuxt.hook("listen", (server) => {
		console.log("Create socket instance")
		const io = new Server(server, {
			serveClient: false
		})

		io.db = require("../api/utils/dbInit")

		io.use((socket,next)=>{
			if (socket.handshake.auth && socket.handshake.auth.token) {
				const result = tokenChecker(socket.handshake.auth.token)
				
				if (result.error)
					return next(new Error(result.code))
				
				socket.token = result.token
				socket.join(`${result.token.id}`)

				return next()
			}
			return next(new Error("NO_REFRESH_TOKEN"))
		})


		io.on("connection", function(socket) {
			socket.use((packet,next)=>{
				const result = tokenChecker(packet[1])
				if (result.error)
					return next(new Error(result.code))
				
				return next()
			})

			socket.on("message", (message) => {
				console.log(message)
			})

			socket.on("disconnecting",()=>{
				socket.broadcast.emit("status", [{
					userId: socket.token.id,
					status: "disconnected"
				}])
			})

			socket.on("getConnectedSockets",async ()=>{

				const { result, err } = await friendQuery.userFriends(io.db,socket.token.id)

				if (err) {
					socket.emit("error",new Error(err.code))
					return
				}
				
				let friendsId = Array()
				result.forEach((friend)=>{
					friendsId.push(friend.userId)
				})
				
				let connected = Array()
				const sockets = await io.fetchSockets()
				sockets.forEach((socket)=>{
					if (friendsId.indexOf(socket.token.id)>-1) {
						connected.push({
							userId: socket.token.id,
							status:"connected"
						})
					}
				})

				socket.emit("status",connected)
			})

			socket.on("error", (err) => {
				console.log("Socket error",err)
				if (err) {
					if (err.message == "EXPIRED_TOKEN" ||
						err.message == "INVALID_TOKEN") {
						socket.emit("error", err)
						socket.broadcast.emit("status",[{
							userId: socket.token.id,
							status:"disconnected"
						}])
						socket.disconnect()
					} else {
						socket.emit("error", {
							error: "Internal error",
							code: "INTERNAL"
						})
					}
				}
			})

			socket.broadcast.emit("status", [{
				userId: socket.token.id,
				status: "connected"
			}])

		})
	})
}