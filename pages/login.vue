<template>
	<section class="formContener">
		<form id="signUpForm" action="#"  method="POST"  class="form" >
			<h2 class="form__title">Log in</h2>
			<p class="form__error"></p>
			<div class="inputGroup">
				<label for="pseudo" class="inputGroup__label">Pseudo:</label>
				<input id="pseudo" v-model="pseudo" type="text"   class="inputGroup__input"   name="pseudo" >
				<div v-if="pseudo.length > 0" class="inputGroup__validator">
					<p 	v-if="pseudoLength"
						class="hideShow inputGroup__validator__criterion">
							Your pseudo must be lenght between 3 and 15 char
					</p>
					<p 	v-if="pseudoForbidden"
						class="hideShow inputGroup__validator__criterion">
							Your pseudo can't contain forbidden char <code>("_'=;/\)</code>
					</p>
					<p 	class="requestValidator inputGroup__validator__criterion">
							Le pseudo est disponible
					</p>
				</div>
			</div>
			<div class="inputGroup">
				<label for="password" class="inputGroup__label">Mot de passe</label>
				<input id="password" v-model="password" type="password"   class="inputGroup__input"   name="password" >
				<div v-if="password.length > 0" class="inputGroup__validator" >
					<p 	v-if="passwordLowerCase"
						class="hideShow inputGroup__validator__criterion" >
							the password must contain lower case char
					</p>
					<p 	v-if="passwordUpperCase"
						class="hideShow inputGroup__validator__criterion" >
							The password must contain upper case char
					</p>
					<p 	v-if="passwordNumber"
						class="hideShow inputGroup__validator__criterion" >
							Teh password must contain a number
					</p>
					<p 	v-if="passwordSpetialChar"
						class="hideShow inputGroup__validator__criterion">
							The password must contain at least one spetial char (*.!@$%^(){}[\]:;,.?/~_+-=|)
					</p>
					<p 	v-if="passwordLenght"
						class="hideShow inputGroup__validator__criterion">
							The password length musth be more than 8 char
					</p>
					<p type="update" update="passwordRepeat"></p>
				</div>
			</div>
			<div class="inputGroup">
				<label for="" class="inputGroup__label">Répétition du mot de passe:</label>
				<input id="passwordRepeat" v-model="passwordRepeat" type="password"   class="inputGroup__input"   name="passwordRepeat" >
				<div class="inputGroup__validator">
					<p 	v-if="passwordMatch"
						class="hideShow inputGroup__validator__criterion">
							Paasword doesn't match
					</p>
				</div>
			</div>
			<input type="submit" value="Create account" class="form__input">
			<img class="form__waitImg" src="/images/wait.svg">
		</form>
	</section>
</template>


<script>

const regexValidators = {
	lower:/[a-z]+/,
	upper:/[A-Z]+/,
	number:/[0-9]+/,
	spetial:/[*.!@$%^&(){}[\]:;<>,.?/~_+-=|]+/,
	mail:/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	forbidden:/^([^<>"_'=;/\\])+$/
}

export default {
	name:"Login",
	data(){
		return {
			pseudo:"",
			password:"",
			passwordRepeat:""
		}
	},
	computed: {
		pseudoLenght: _ => this.pseudo.length > 3 && this.pseudo.length <= 15,
		pseudoForbidden: _ => !this.pseudo.match(regexValidators.forbidden),
		passwordLowerCase: _ => !this.pseudo.match(regexValidators.lower),
		passwordUpperCase: _ => !this.pseudo.match(regexValidators.upper),
		passwordSpetialChar: _ => !this.pseudo.match(regexValidators.spetial),
		passwordNumber: _ => !this.pseudo.match(regexValidators.number)
	},
}
</script>


<style lang="scss" scoped>
@import "../assets/scss/colors";
.form {
	padding:10px;
	width: max-content;
	height: max-content;
	border-radius:10px;
	background:$elementsBackground;

	width:clamp(50%, 200px, 400px);

	display:block;
	margin:auto;

	&__title{
		width: 100%;
		text-align: center;
	}

	&__error {
		margin:0;
		text-align: center;
		width:100%;
		color:red;
	}

	&__closeButton{
		cursor: pointer;
		float: right;
		&__image {
			height:2em;
			width: 2em;
		}
	}
	&__waitImg{
		display:none;
	}

	$parent:&;

	&.wait{
		& *:not(#{$parent}__waitImg){
			display:none;
		}
		#{$parent}__waitImg{
			display:block;
		}
	}

	input {
		width:100%;
	}
}

.inputGroup {
	display:flex;
	flex-direction: column;
	&__validator {
		&__criterion{
			margin:0;
			word-wrap: break;

			&.hideShow{
				color:red;
			}

			&.requestValidator {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: left;
				&.valide{
					color:#26F53C;

					&::before {
						content:"✔";
						color:#26F53C;
					}
				}

				&.error{
					color:red;

					&::before {
						margin-right: 3px;
						content:"❌";
						color:red;
					}
				}

				&.wait::before {
						background: url("@/assets/images/wait.svg");
						background-size: cover;
						content: "";
						width:30px;
						height:30px;
						align-self: center;
						display: inline-block;
				}
			}
		}
	}
}
</style>