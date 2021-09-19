export const state = () => ({
	accessToken: "",
	expireat: 0,
	pseudo: ""
})

export const mutations = {
	UPDATE_ACCESS_TOKEN({ token, expireat }) {
		this.accessToken = token
		this.expireat = expireat
	},

	SET_PSEUDO(pseudo) {
		this.pseudo = pseudo
	},

	CLEAR_TOKEN() {
		this.accessToken = ""
		this.pseudo = ""
	}
}

export const getters = {
	connected() {
		return this.accessToken && this.expireat > Date.now()
	}
}

export const actions = {
	async signin(context,{ pseudo, password }) {
		const result = await fetch("/api/user/signin", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				pseudo,
				password
			})
		})
		
		const json = await result?.json()

		if (!json) {
			return { err: "INTERNAL" }
		}

		if (!json.error && result.status >= 200 && result.status <= 299) {
			context.commit("UPDATE_ACCESS_TOKEN", {
				token: json.token,
				expireat: json.expireat
			})
			return {}
		}

		return { err: json.code }
	},

	async updateToken(context) {
		const response = await fetch("/api/user/refresh", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				token: this.refreshToken
			})
		})

		const json = await response?.json()

		if (!json) {
			context.dispatch("logout")
		}

		if (!json.error) {
			context.commit("UPDATE_ACCESS_TOKEN", {
				token: json.token,
				expireat: json.expireat
			})
			context.commit("UPDATE_PSEUDO", json.pseudo)
		}
	},

	async logout(context) {
		await fetch("/api/user/logout", {
			method: "POST"
		})
		context.commit("user/CLEAR_TOKENS")
		this.$route.push("/signup")
	}
}