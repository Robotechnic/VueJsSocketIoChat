const jwt = require("jsonwebtoken")

export default async function ({app, store, redirect }) {
	if (process.server){
		const refreshToken = app.$cookiz.get("refreshToken")
		if (!refreshToken){
			redirect("/signin")
		}
		try {
			jwt.verify(refreshToken, process.env.TOKEN_SECRET)
		} catch (err) {
			if (err.name !== "JsonWebTokenError" && err.name !== "TokenExpiredError") {
				console.error(err) // log error only if it's unknown
			}
			redirect("/signin")
		}
		await store.dispatch("user/updateFromLocalSorage")
	} else {
		await store.dispatch("user/updateFromLocalSorage")
		if (!store.getters["user/connected"]) {
			redirect("/signin")
		}
	}
}
