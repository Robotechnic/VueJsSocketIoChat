export default ({ app }, inject) => {
	inject("serverOrigin", () => {
		let serverUrl = ""

		if (process.server) {
			serverUrl = process.env.ORIGIN
		}
		return serverUrl
	})
}