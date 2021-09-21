export default ({ app }, inject) => {
	inject("customFetch", async (url,jsonContent) => {
		const headers = {
			"Accept": "application/json",
			"Content-Type": "application/json",
		}
		let serverUrl = ""
		
		if (process.server){
			serverUrl = process.env.ORIGIN
			headers.Cookie = `refreshToken=${app.$cookiz.get("refreshToken")}`
		}

		const result = await fetch(serverUrl + url, {
			method: "POST",
			headers,
			body: JSON.stringify(jsonContent)
		})

		return {
			json: await result?.json(),
			status: result.status
		}
	})
}