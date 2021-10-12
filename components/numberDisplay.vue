<template>
	<div class="numberDisplay">
		<span class="numberDisplay__number">{{number}}</span>
		<slot></slot>
	</div>
</template>

<script>
export default {
	props: {
		number: {
			type: Number,
			required:true
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
.numberDisplay {
	position: relative;

	&__number {
		position: absolute;
		right: 0;
		top: -0.5em;
		border-radius: 1em;
		height: 1em;
		width: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
		background: $secondaryColor;
	}
}
</style>