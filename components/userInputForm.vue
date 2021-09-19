<template>
	<form ref="form" class="form" @submit.prevent="processUserInfo">
		<h2 class="form__title"> {{ title }}</h2>
		<p v-if="error" class="form__error"> 
			{{ error }}
		</p>
		<p class="form__success">
			<img src="@/assets/icons/tick.png" />
			<slot name="successMessage"></slot>
		</p>
		<img src="@/assets/images/wait.svg" class="form__waitImg"/>
		<slot></slot>
	</form>
</template>

<script>
export default {
	name: "UserInputForm",
	props: {
		title: {
			type: String,
			required: true
		}
	},
	data(){
		return {
			error: ""
		}
	},
	methods: {
		processUserInfo() {
			this.$emit("newUserData",this)
		},
		setSuccess(redirectUrl, redirectTimeout){
			this.$refs.form.classList.remove("wait")
			this.$refs.form.classList.add("success")

			setTimeout(()=>{
				this.$router.push(redirectUrl)
			},redirectTimeout)
		},
		setWait() {
			this.$refs.form.classList.add("wait")
			this.$refs.form.classList.remove("success")
		},
		setError(err){
			this.$refs.form.classList.remove("wait")
			this.$refs.form.classList.remove("success")
			this.error = err
		}
	},
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
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

	&__success {
		display: none;
	}

	$parent:&;

	&.wait{
		& *:not(#{$parent}__waitImg){
			display:none;
		}

		#{$parent}__title {
			display: inherit;
		}

		#{$parent}__waitImg{
			display:block;
			margin: auto;
		}
	}

	&.success {
		& *:not(#{$parent}__success){
			display:none;
		}

		#{$parent}__title {
			display: inherit;
		}

		#{$parent}__success{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			> * {
				display: block;
			}
		}
	}

	input {
		width:100%;
	}
}
</style>