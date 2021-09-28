<template>
	<nuxt-link class="user" :to="'/'+user.userId">
		<UserImage :pseudo="user.pseudo" class="user__image" />
		<p class="user__pseudo">{{user.pseudo}}</p>
		<div 
			class="user__status" 
			:class="{connected:user.status == 'connected'}"
			>
			&nbsp;
		</div>
	</nuxt-link>
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
	justify-content: center;
	align-items: center;
	align-self: stretch;
	margin: 10px 5px;
	text-decoration: none;
	color: $textColor;

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

	&__status {
		border-radius: 100%;
		min-width: 1.2em;
		min-height:1.2em;
		max-width: 1.2em;
		max-height:1.2em;

		&.connected {
			background:green;
		}

		background:red;
	}
}
</style>