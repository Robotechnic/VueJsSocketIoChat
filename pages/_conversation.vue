<template>
	<div class="chatContener">
		<header>
			<h1>NuxtCHat</h1>
		</header>
		<nav class="friends">

		</nav>
		<section v-if="!$route.params.conversation" class="homePresentation">
			<h1>Home</h1>
		</section>
		
	</div>
</template>

<script>
import Messages from "../components/messages.vue"
export default {
	components:[
		Messages
	]
}
</script>
