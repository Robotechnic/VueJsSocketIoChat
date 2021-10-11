<template>
<section class="signin">
	<UserInputForm :error="error" title="Sign In" @newUserData="processUserInfo">
		<template #successMessage>
			Succesfull conection.<br />
			You will be redirected in some seconds.
		</template>
		<InputGroup
			v-model="pseudo"
			name="pseudo"
			label="Pseudo :"
			type="text"
		/>
		<InputGroup
			v-model="password"
			name="password"
			label="Mot de passe :"
			type="password"
		/>
		<input type="submit" value="Se connecter" />
		<p>
			New here ?
			<nuxt-link to="/signup">
				Create an account !
			</nuxt-link>
		</p>
	</UserInputForm>
</section>
</template>

<script>
export default {
	data() {
		return {
			pseudo:"",
			password:"",
			error: ""
		}
	},
	header() {
		return {
			title: "VuejsSocketIOChat - SignIn"
		}
	},
	methods: {
		async processUserInfo(form) {
			const target = form.$el

			if (this.pseudo.length === 0){
				target.pseudo.focus()
				form.setError("Please provide a pseudo")
				return
			}

			if (this.password.length === 0){
				target.password.focus()
				form.setError("Please provide a password")
				return
			}

			form.setWait()

			const result = await this.$store.dispatch("user/signin",{
				pseudo: this.pseudo,
				password: this.password
			})

			if (!result.err) {
				this.$router.push("/")
				return
			}

			switch (result.err) {
				case "EMPTY_FIELDS":
					form.setError("Please fill up all fields.")
					if (this.pseudo.length === 0)
						target.pseudo.focus()
					else
						target.password.focus()
					break
				case "USER_NOT_EXIST":
					form.setError("The pseudo doesn't exist")
					this.password = ""
					this.pseudo = ""
					break
				case "WRONG_PASSWORD":
					form.setError("Invalid password")
					this.password = ""
					break
				default:
					form.setError("Internal error appened. Please, retry later.")
					this.password = ""
					break
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.signin {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>