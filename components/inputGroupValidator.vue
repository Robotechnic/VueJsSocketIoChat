<template>
	<p class="inputGroupValidator" :class="{invalid: validator}">
		{{ message }}
	</p>
</template>

<script>
export default {
	name: "InputGroupValidator",
	props: {
		validator: {
			type: Boolean,
			required: true
		},
		message: {
			type: String,
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
.inputGroupValidator {
	color: red;
	display: none;

	&.invalid {
		display: block;
	}
}
</style>