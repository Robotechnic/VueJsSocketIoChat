<template>
	<section class="signup">
		<UserInputForm title="Sign Up" @newUserData="processUserInfo">
			<template #successMessage>
				You have been registered succesfully.
				<br />
				You will be redirected to singnin page in a few seconds.
			</template>
			<InputGroup 
				v-model="pseudo"
				name="pseudo" 
				type="text" 
				label="Pseudo :"
				>
				<InputGroupValidator 
					:validator="pseudoLength"
					message="The pseudo must be between 3 and 15 char long"
					/>
				<InputGroupValidator 
					:validator="pseudoForbidden"
					message="The pseudo can't contain (<>&quot;_'=;/\)"
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
					message="The password must be at least 8 char long"
					/>
				<InputGroupValidator 
					:validator="passwordLowerCase"
					message="The password must contain at least one lower case letters"
					/>
				<InputGroupValidator 
					:validator="passwordNumber"
					message="The password must contain at least one number"
					/>
				<InputGroupValidator 
					:validator="passwordUpperCase"
					message="The password must contain at least one uper case letters"
					/>
				<InputGroupValidator 
					:validator="passwordSpetialChar"
					message="The password must contain at least one spetial char (*.!@$%^&amp;(){}[\]:;<>,.?/~_+-=|)"
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
					message="The password don't match"
					/>
			</InputGroup>
			<input type="submit" value="Create account" class="form__input">
			<p>
				Alrealy an acount?
				<nuxt-link to="/signin">
					Sign in
				</nuxt-link>
			</p>
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
		pseudoLength() {return this.pseudo.length < 3 || this.pseudo.length > 12},
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

			const {json, error} = await this.$customFetch("/api/user/signup", {
				pseudo: target.pseudo.value,
				password: target.password.value
			})

			if (!error) {// if there is no error, display valid message 
				form.setSuccess("/signin",2000)
				return
			}

			// process json error if is there
			switch (json.code) {
				case "EMPTY_FIELDS":
					form.setError("Please, fill up all fields")
					break
				case "INVALID_FIELD_PSEUDO":
					target.pseudo.focus()
					form.setError("The pseudo isn't a valid one")
					break
				case "INVALID_FIELD_PASSWORD":
					target.password.focus()
					form.setError("The password isn't a valid one")
					break
				case "PSEUDO_EXIST":
					target.pseudo.focus()
					form.setError("Your pseudo alrealy exists")
					break
				default:
					form.setError("An internal error appened. Please, retry later")
					break
			}
		}
	}
}
</script>


<style lang="scss" scoped>
.signup {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>