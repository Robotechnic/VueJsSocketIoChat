export default function ({app, store, redirect }) {
	if (process.server){
		const refreshToken = app.$cookiz.get("refreshToken")
		if (!refreshToken){
			redirect("/signin")
		}
	} else if (!store.state.user.connected) {
		redirect("/signin")
	}
}
