<template>
	<div class="user">
		<BaseUser :user="user"/>
		<nav class="user__confirm">
			<button class="user__confirm__button" @click="$emit('accept')">
				<img class="user__confirm__button__image" src="@/assets/icons/validate.svg" alt="validate"/>
			</button>
			<button class="user__confirm__button" @click="$emit('cancel')">
				<img class="user__confirm__button__image" src="@/assets/icons/cancel.svg" alt="cancel"/>
			</button>
		</nav>
	</div>
</template>

<script>

export default {
	name:"User",
	props: {
		user: {
			type:Object,
			required:true
		}
	},
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/colors";
.user {
	display:flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	text-decoration: none;
	color: $textColor;

	width: 100%;

	&__confirm {
		$confirmSize:1.5em;
		display: flex;

		&__button {
			margin: 0px 10px;
			display: flex;
			align-items: center;
			justify-content: center;

			width: $confirmSize*1.5;
			height: $confirmSize*1.5;

			&__image {
				width: $confirmSize;
				height: $confirmSize;
			}
		}
	}
}
</style>