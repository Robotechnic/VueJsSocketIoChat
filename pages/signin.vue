<template>
	<UserInputForm :error="error" title="Sign In" @newUserData="processUserInfo">
		<template v-slot:successMessage>
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

			if (target.pseudo.length === 0){
				target.pseudo.focus()
				form.setError("Veuillez mettre un pseudo")
			}

			if (target.password.length === 0){
				target.password.focus()
				form.setError("Veuillez mettre un mot de passe")
			}

			form.setWait()

			const result = await fetch("/api/user/signin",{
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					pseudo: target.pseudo.value,
					password: target.password.value
				})
			})

			const json = result?.json()

			if (!json) {
				form.setError("Erreur interne, veuillez recommencer plus tard")
				return
			}

			if (!json.error) {
				form.setSuccess("/",1500)
			}

			switch (json.code) {
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
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/colors";
</style>