const headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
}

export default ({ app }, inject) => {
	inject("customFetch", async (url,jsonContent) => {
		if (process.server)
			headers.Cookie = `refreshToken=${app.$cookiz.get("refreshToken")}`
		
		const result = await fetch(app.$serverOrigin() + url, {
			method: "POST",
			headers,
			body: JSON.stringify(jsonContent)
		})

		const json = await result?.json()
		let error = false

		if (!json || json.code) {
			error = true
		}
		
		return {
			json,
			error,
			status: result.status
		}
	})
}