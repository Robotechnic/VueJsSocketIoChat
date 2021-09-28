<template>
	<UserInputForm :error="error" title="Sign In" @newUserData="processUserInfo">
		<template #successMessage>
			Connexion réussie.<br />
			Vous serez redirigé dans quelques secondes
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
			Pas encore de compte ?
			<nuxt-link to="/signup">
				Créez en un
			</nuxt-link>
		</p>
	</UserInputForm>
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

			if (target.pseudo.value.length === 0){
				target.pseudo.focus()
				form.setError("Veuillez mettre un pseudo")
				return
			}

			if (target.password.value.length === 0){
				target.password.focus()
				form.setError("Veuillez mettre un mot de passe")
				return
			}

			form.setWait()

			const result = await this.$store.dispatch("user/signin",{
				pseudo: target.pseudo.value,
				password: target.password.value
			})

			if (!result.err) {
				this.$router.push("/")
				return
			}

			switch (result.err) {
				case "EMPTY_FIELDS":
					form.setError("Veuillez remplir tous les champs")
					if (target.pseudo.value.length === 0)
						target.pseudo.focus()
					else
						target.password.focus()
					break
				case "USER_NOT_EXIST":
					form.setError("Le nom d'utilisateur est invalide")
					this.password = ""
					this.pseudo = ""
					break
				case "WRONG_PASSWORD":
					form.setError("Le mot de passe est invalide")
					this.password = ""
					break
				default:
					form.setError("Une erreur interne est survenue, veuillez recommencer plus tard")
					this.password = ""
					break
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
</style>