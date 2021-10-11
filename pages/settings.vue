<template>
	<section>
		<Header />
		<nav class="settings">
			<UserInputForm title="Edit pseudo" @newUserData="changePseudo">
				<template #successMessage>
					Votre pseudo a été changé avec succés
				</template>
				<InputGroup
					v-model="pseudo"
					name="pseudo"
					label="Pseudo :"
					type="text"
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
				<input type="submit" value="Change"/>
			</UserInputForm>
			<UserInputForm title="Edit password" @newUserData="changePassword">
				<template #successMessage>
					<br />
					Vous serez redirigé dans quelques secondes
				</template>
				<InputGroup
					v-model="holdPassword"
					name="holdPassword"
					label="Hold password :"
					type="password"
				/>
				<InputGroup
					v-model="newPassword"
					name="newPassword"
					label="New password :"
					type="password"
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
					v-model="newPasswordRepeat"
					name="newPasswordRepeat"
					label="Confirm new password :"
					type="password"
				>
					<InputGroupValidator 
						:validator="passwordMatch"
						message="The password don't match"
					/>
				</InputGroup>
				
				<input type="submit" value="Change"/>
			</UserInputForm>
		</nav>
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
	data() {return {
		pseudo:"",
		password:"",
		newPassword:"",
		newPasswordRepeat:"",
		holdPassword:""
	}},
	head() {return{
		title: "NuxtChat - Settings"
	}},
	middleware: "autenticated",
	computed: {
		pseudoLength() {return this.pseudo.length < 3 || this.pseudo.length > 12},
		pseudoForbidden() { return Boolean(this.pseudo.match(regexValidators.forbidden))},
		passwordLowerCase() { return !this.newPassword.match(regexValidators.lower)},
		passwordUpperCase() { return !this.newPassword.match(regexValidators.upper)},
		passwordSpetialChar() { return !this.newPassword.match(regexValidators.spetial)},
		passwordNumber() { return !this.newPassword.match(regexValidators.number)},
		passwordLenght() { return this.newPassword.length < 8},
		passwordMatch() { return Boolean(this.newPassword !== this.newPasswordRepeat)}
	},
	methods: {
		async changePseudo(form){
			const target = form.$el

			if (this.pseudoLength || this.pseudoForbidden) {
				target.pseudo.focus()
				return
			}

			form.setWait()
			const {err,json} = await this.$store.dispatch("user/updatePseudo",this.pseudo)

			if (!err) {
				this.pseudo = ""
				form.setSuccess("/",2000,false)
				return
			}

			const error = this.$errorManager(json)
			
			switch (error.code){
				case "EMPTY_FIELDS":
					target.pseudo.focus()
					form.setError("Filed pseudo is required")
					break
				case "PSEUDO_EXIST":
					target.pseudo.focus()
					form.setError("The pseudo is alrealy taken")
					break
				default:
					form.setError("Internal error appened. Please, retry later")
					break
			}
		},
		changePassword() {

		}
	}
}
</script>


<style lang="scss" scoped>
.settings {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 20px;
	flex-wrap: wrap;
}
</style>