<template>
	<nuxt-link class="user" :to="'/'+user.userId">
		<BaseUser :user="user"/>
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