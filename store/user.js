export const state = () => ({
	accessToken: "",
	expireat: 0,
	pseudo: "",
	userId: 0
})

export const mutations = {
	UPDATE_ACCESS_TOKEN(state,{ token, expireat }) {
		state.accessToken = token
		state.expireat = expireat
		localStorage.setItem("accessToken",token)
		localStorage.setItem("expireat", expireat)
	},

	UPDATE_USER(state,{id, pseudo}) {
		state.pseudo = pseudo
		state.userId = id
		localStorage.setItem("pseudo", pseudo)
		localStorage.setItem("userId", id)
	},
	CLEAR_TOKEN(state) {
		state.accessToken = ""
		state.pseudo = ""
		localStorage.setItem("accessToken", "")
		localStorage.setItem("expireat", "")
		localStorage.setItem("pseudo", "")
		localStorage.setItem("userId", "")
	}
}

export const getters = {
	connected(state) {
		return state.accessToken !== "" && state.expireat > Date.now()
	}
}

export const actions = {
	async signin({commit},{ pseudo, password }) {
		const {json,status} = await this.$customFetch("/api/user/signin",{
			pseudo,
			password
		})
		

		if (!json) {
			return { err: "INTERNAL" }
		}

		if (!json.error && status >= 200 && status <= 299) {
			commit("UPDATE_ACCESS_TOKEN", {
				token: json.token,
				expireat: Date.now() + json.expirein
			})

			commit("UPDATE_USER", {
				pseudo: json.pseudo,
				id: json.id
			})
			return {}
		}

		return { err: json.code }
	},

	async updateToken({commit, dispatch}) {
		const { json } = await this.$customFetch("/api/user/signin", {
			token: this.refreshToken
		})

		if (!json) {
			dispatch("logout")
		}

		if (!json.error) {
			commit("UPDATE_ACCESS_TOKEN", {
				token: json.token,
				expireat: Date.now() + json.expirein
			})
			commit("UPDATE_USER", {
				pseudo: json.pseudo,
				id: json.id
			})
		}
	},

	async logout({commit}) {
		await this.$customFetch("/api/user/signin", {})
		commit("user/CLEAR_TOKENS")
		this.$route.push("/signup")
	},

	async updateFromLocalSorage(context) {
		if (context.getters.connected)
			return

		if (process.server){
			await context.dispatch("updateToken")
			return
		}
		
		if (Number(localStorage.getItem("expireat")) < Date.now()) {
			context.commit("CLEAR_TOKEN")
			await context.dispatch("updateToken")
			return
		}

		context.commit("UPDATE_ACCESS_TOKEN",{
			token: localStorage.getItem("accessToken"),
			expireat: Number(localStorage.getItem("expireat"))
		})
		context.commit("UPDATE_USER",{
			pseudo: localStorage.getItem("pseudo"),
			id: Number(localStorage.getItem("userId"))
		})
	}
}