const { Server } = require("socket.io")

const dbQuery = require("../api/utils/dbQuery")
const friendQuery = require("../api/utils/friendQuery")
const tokenChecker = require("./middlewares/token")

module.exports = function () {
	this.nuxt.hook("listen", (server) => {
		console.log("Create socket instance")
		const io = new Server(server, {
			serveClient: false
		})

		io.db = require("../api/utils/dbInit")

		io.use((socket, next) => {
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


		io.on("connection", function (socket) {
			socket.use(require("./middlewares/socketAutentication"))

			socket.on("message", require("./socketRoutes/messages"))

			socket.on("disconnecting", () => {
				socket.broadcast.emit("status", [{
					userId: socket.token.id,
					status: "disconnected"
				}])
			})

			socket.on("getConnectedSockets", require("./socketRoutes/getConnectedSockets")(io.db, socket))

			socket.on("error", require("./socketRoutes/error"))

			socket.broadcast.emit("status", [{
				userId: socket.token.id,
				status: "connected"
			}])

		})
	})
}