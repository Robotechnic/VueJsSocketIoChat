export default ({store, app }, inject) => {
	inject("errorManager", (json) => {
		if (!json)
			return { errorCaptured: true, code: "" }
		if (!json.code)
			return { errorCaptured: false, code: "" }
		switch (json.code) {
			case "INVALID_TOKEN":
			case "INVALID_TOKEN_IP":
				store.dispatch("user/logout")
				return { errorCaptured: true, code: "" }
			case "EXPIRED_TOKEN":
				store.dispatch("user/updateToken")
				return { errorCaptured: true, code: "" }
			case "INTERNAL":
				return { errorCaptured: true, code: "" }
			default:
				return { errorCaptured: true, code: json.code }
		}
	})
}