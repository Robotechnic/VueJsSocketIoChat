<template>
	<div class="chatContener">
		<header>
			<h1 class="header__title">NuxtChat</h1>
		</header>
		<Friends :userId="$store.state.user.userId"/>
		<nuxt-child />
		<MessageEditor class="editor" @send-message="addMessage"/>
	</div>
</template>

<script>
export default {
	name: "Conversation",
	middleware: "autenticated",
	data() {
		return {
			messages:[]
		}
	},
	computed: {
		messageList(){ // get message list populated with user data
			const result = []
			
			for (const i in this.messages){
				result.push({
					text:this.messages[i].text,
					user:this.userFromId(this.messages[i].userId)
				})
			}
			return result
		}
	},
	methods:{
		addMessage(message){
			this.messages.push({
				userId:-1,
				text:message
			})
		}
	}
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/colors";
.chatContener {
	display:grid;
	grid-template-areas:"header header"
						"friend main"
						"friend editor";
	gap:5px;
	grid-template-columns: .2fr 1fr;
	grid-template-rows: max-content 1fr max-content;
	height:100vh;
}

header {
	grid-area:header;
	padding-left:20px;

	.header__title {
		margin:2px;
	}
}

.mainContent {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}

.homePresentation {
	@extend .mainContent;
	grid-area:main;
	padding: 0px 15px;
}

.messageDisplay {
	@extend .mainContent;
	grid-area:main;
	overflow-y: scroll;
	background:$elementsBackground;

	&__start {
		margin-left: 20px;
		margin-right: 20px;
	}
}

.editor {
	grid-area:editor;
}

</style>