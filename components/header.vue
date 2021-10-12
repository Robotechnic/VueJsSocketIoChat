<template>
	<header class="header">
		<h1 class="header__title">
			<nuxt-link to="/">
				NuxtChat
			</nuxt-link>
		</h1>
		<BaseUser :user="$store.state.user" class="header__currentUser"/>
		<nav class="header__actionsContener">
				<button 
					class="noStyle header__actionsContener__action"
					@click="$router.push('/settings')"
				>
					<img src="@/assets/icons/settings.svg" />
				</button>

				<button 
					class="noStyle header__actionsContener__action"
					@click="$store.dispatch('user/logout')"
				>
				<img src="@/assets/icons/logout.svg" />
			</button>
		</nav>
	</header>
</template>

<style lang="scss" scoped>
.header {
	grid-area:header;
	padding-left:20px;
	display: flex;
	justify-content: right;
	align-items: center;
	&__title {
		margin:2px;
		margin-right: auto;
	}
	&__actionsContener {
		display: flex;
		&__action {
			padding:0;
			margin: 0px 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				width: 50px;
				height: 50px;
			}
		}
	}
}
</style>