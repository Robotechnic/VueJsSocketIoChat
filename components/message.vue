<template>
	<div class="message">
		<img :src="message.user.image" :alt="message.user.pseudo + '\'s avatar'" class="message__userImage">
		<h3 class="message__userPseudo">{{message.user.pseudo}}</h3>
		<p class="message__content">{{message.text}}</p>
	</div>
</template>

<script>
export default {
	name:"Message",
	props:{
		message:{
			type: Object,
			required:true
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
.message {
	display:grid;
	grid-template-areas: "img pseudo"
							"img text";
	grid-template-columns: min-content auto;
	column-gap: 15px;

	border-top:1px solid $textColor;
	margin-left: 20px;
	margin-right: 20px;
	padding: 10px 20px;
	
	&__userImage {
		grid-area: img;
		border-radius: 25%;
		height:60px;
	}

	&__userPseudo {
		grid-area: pseudo;
		margin:0;
	}

	&__content {
		grid-area: text;
	}
}
</style>