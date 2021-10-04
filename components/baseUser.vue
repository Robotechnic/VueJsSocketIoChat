<template>
	<div class="user">
		<UserImage :pseudo="user.pseudo" class="user__image" />
		<p class="user__pseudo">{{user.pseudo}}</p>
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
.user {
	display: flex;
	align-items: center;
	margin: 0px 5px;

	&__image {
		min-width: 2em;
		min-height:2em;
		max-width: 2em;
		max-height:2em;
		border-radius: 25%;
	}

	&__pseudo {
		margin:0;
		display: block;
		margin-right: auto;
		margin-left: 5px;
		padding: 0px 10px;
	}
}
</style>