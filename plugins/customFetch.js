export default ({ app }, inject) => {
	inject("customFetch", async (url,jsonContent) => {
		let serverUrl = ""
		if (process.server)
			serverUrl = process.env.ORIGIN
		const result = await fetch(serverUrl + url, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonContent)
		})

		return {
			json: await result?.json(),
			status: result.status
		}
	})
}