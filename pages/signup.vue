<template>
	<section class="formContener">
		<UserInputForm title="Sign Up" @newUserData="processUserInfo">
			<template #successMessage>
				Vous avez été enregistré avec succés.
				<br />
				Vous serez redirigé vers la page de connexion dans quelques secondes.
			</template>
			<InputGroup 
				v-model="pseudo"
				name="pseudo" 
				type="text" 
				label="Pseudo :"
				>
				<InputGroupValidator 
					:validator="pseudoLength"
					message="Le pseudo doit faire entre 3 et 15 caractères"
					/>
				<InputGroupValidator 
					:validator="pseudoForbidden"
					message="Le pseudo ne doit pas contenir de caratères interdits (<>&quot;_'=;/\)"
					/>
			</InputGroup>

			<InputGroup 
				v-model="password"
				name="password" 
				type="password" 
				label="Mot de passe :"
				>
				<InputGroupValidator 
					:validator="passwordLenght"
					message="Le mot de passe doit faire au moins 8 caractères"
					/>
				<InputGroupValidator 
					:validator="passwordLowerCase"
					message="Le mot de passe doit contenir au moins une lettre minuscule"
					/>
				<InputGroupValidator 
					:validator="passwordNumber"
					message="Le mot de passe doit contenir au moins un chiffre"
					/>
				<InputGroupValidator 
					:validator="passwordUpperCase"
					message="Le mot de passe doit contenir au moins une lettre majuscule"
					/>
				<InputGroupValidator 
					:validator="passwordSpetialChar"
					message="Le mot de passe doit contenir au moins un caratère spécial (*.!@$%^&amp;(){}[\]:;<>,.?/~_+-=|)"
					/>
				
			</InputGroup>

			<InputGroup 
				v-model="passwordRepeat"
				name="passwordRepeat" 
				type="password" 
				label="Répétition du mot de passe :"
				>
				<InputGroupValidator 
					:validator="passwordMatch"
					message="Les mots de passes ne correspondent pas"
					/>
			</InputGroup>
			<input type="submit" value="Create account" class="form__input">
			<p>
				Déjà un compte ?
				<nuxt-link to="/signin">
					Connectez vous
				</nuxt-link>
			</p>
			<img class="form__waitImg" src="@/assets/images/wait.svg">
		</UserInputForm>
	</section>
</template>


<script>

const regexValidators = {
	lower:/[a-z]+/,
	upper:/[A-Z]+/,
	number:/[0-9]+/,
	spetial:/[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|]+/,
	forbidden:/([<>"_'=;/\\])/
}

export default {
	name: "SignUp",
	data(){
		return {
			pseudo:"",
			password:"", 
			passwordRepeat:"",
			error: ""
		}
	},
	header() {
		return {
			title: "VuejsSocketIOChat - SignUp"
		}
	},
	computed: {
		pseudoLength() {return this.pseudo.length < 3 || this.pseudo.length > 15},
		pseudoForbidden() { return Boolean(this.pseudo.match(regexValidators.forbidden))},
		passwordLowerCase() { return !this.password.match(regexValidators.lower)},
		passwordUpperCase() { return !this.password.match(regexValidators.upper)},
		passwordSpetialChar() { return !this.password.match(regexValidators.spetial)},
		passwordNumber() { return !this.password.match(regexValidators.number)},
		passwordLenght() { return this.password.length < 8},
		passwordMatch() { return Boolean(this.password !== this.passwordRepeat)}
	},
	methods: {
		async processUserInfo(form) {
			const target = form.$el
			// check for user informations
			if (this.pseudoLength || this.pseudoForbidden) {
				target.pseudo.focus()
				return
			}

			if (this.passwordLowerCase ||
				this.passwordUpperCase ||
				this.passwordSpetialChar ||
				this.passwordNumber ||
				this.passwordLenght) {
				target.password.focus()
				return
			}

			if (this.passwordMatch) {
				target.password.focus()
				return
			}

			// send data to api
			form.setWait(target)

			const result = await fetch("/api/user/signup", {
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

			const json = await result?.json()

			if (!json) { // if the server doesn't give json response, display error message
				form.setError("Un erreur interne est suvenue, veuillez recommencer plus tard.")
			}

			if (!json.error) {// if there is no error, display valid message 
				form.setSuccess("/signin",2000)
				return
			}

			// process json error if is there
			switch (json.code) {
				case "EMPTY_FIELDS":
					form.setError("Veuillez remplir tous les champs")
					break
				case "INVALID_FIELD_PSEUDO":
					target.pseudo.focus()
					form.setError("Le pseudo est invalide")
					break
				case "INVALID_FIELD_PASSWORD":
					target.password.focus()
					form.setError("Le mot de passe est invalide")
					break
				case "PSEUDO_EXIST":
					target.pseudo.focus()
					form.setError("Le pseudo existe déjà")
					break
				default:
					form.setError("Une erreur interne est survenue, recommencez plus tard")
					break
			}
		}
	}
}
</script>