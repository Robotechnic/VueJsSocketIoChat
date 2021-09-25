<template>
	<nuxt-link class="user" :to="'/'+user.id">
		<UserImage :pseudo="user.pseudo" class="user__image" />
		<p class="user__pseudo">{{user.pseudo}}</p>
		<div class="user__status" :class="{connected:user.status == 'connected',disconnected:user.status == 'disconected'}">&nbsp;</div>
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
	align-items: center;
	margin: 10px 5px;
	text-decoration: none;
	color: $textColor;

	&__image {
		width:2em;
		height:2em;
		border-radius: 25%;
	}

	&__pseudo {
		margin:0;
		display: block;
		margin-right: auto;
		margin-left: 5px;
	}

	&__status {
		border-radius: 100%;
		width:1.2em;
		height:1.2em;

		&.connected {
			background:green;
		}

		&.disconnected {
			background:red;
		}
	}
}
</style>