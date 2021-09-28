export const state = () => ({
	accessToken: "",
	expireat: 0,
	pseudo: "",
	userId: 0,
	refreshTimeoutId: -1
})

export const mutations = {
	UPDATE_ACCESS_TOKEN(state,{ token, expireat }) {
		state.accessToken = token
		state.expireat = expireat
		if (process.server) return
		localStorage.setItem("accessToken",token)
		localStorage.setItem("expireat", expireat)
	},

	UPDATE_USER(state,{id, pseudo}) {
		state.pseudo = pseudo
		state.userId = id
		if (process.server) return
		localStorage.setItem("pseudo", pseudo)
		localStorage.setItem("userId", id)
	},
	CLEAR_TOKEN(state) {
		state.accessToken = ""
		state.pseudo = ""
		if (process.server) return
		localStorage.setItem("accessToken", "")
		localStorage.setItem("expireat", "")
		localStorage.setItem("pseudo", "")
		localStorage.setItem("userId", "")
	},

	REFRESH_TIMEOUT(state,id) {
		if (state.refreshTimeoutId >= 0) {
			clearTimeout(state.refreshTimeoutId)
		}
		state.refreshTimeoutId = id
	}
}

export const getters = {
	connected(state) {
		return state.accessToken !== "" && state.expireat > Date.now()
	}
}

export const actions = {
	async signin({commit,dispatch},{ pseudo, password }) {
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

			dispatch("resetRefreshInterval", json.expirein - 10000)
			return {}
		}

		return { err: json.code }
	},

	async updateToken({commit, dispatch}) {
		const { json } = await this.$customFetch("/api/user/refresh", {})

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

		switch (json.code) {
			case "EXPIRED_REFRESH_TOKEN":
				this.$router.push("/signin")
			break
		}
	},

	async logout({commit}) {
		await this.$customFetch("/api/user/logout", {})
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
	},

	resetRefreshInterval(context, duration) {
		context.commit("REFRESH_TIMEOUT",setTimeout(()=>{
			context.dispatch("updateToken")
		}, duration))
	}
}