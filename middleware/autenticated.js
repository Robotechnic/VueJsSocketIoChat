export default async function ({app, store, redirect }) {
	if (process.server){
		const refreshToken = app.$cookiz.get("refreshToken")
		if (!refreshToken){
			redirect("/signin")
		}
	} else {
		await store.dispatch("user/updateFromLocalSorage")
		if (!store.getters["user/connected"]) {
			redirect("/signin")
		}
	}
}
