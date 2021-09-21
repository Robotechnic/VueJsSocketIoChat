export default async function ({app, store, redirect }) {
	if (process.server){
		const refreshToken = app.$cookiz.get("refreshToken")
		if (!refreshToken){
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
