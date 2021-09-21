<template>
	<div class="chatContener">
		<header>
			<h1 class="header__title">NuxtChat</h1>
		</header>
		<Friends :userId="$store.state.user.userId"/>
		<section v-if="!$route.params.conversation" class="homePresentation">
			<h1>Home</h1>
			<p>Welcome to this beautifull chat</p>
		</section>

		<section v-else ref="messageDisplay" class="messageDisplay">
			<p class="messageDisplay__start">This is the begining of this conversation.<br/>To start, you just need to type a message in the area on the bottom.</p>
			<Message v-for="message,index in messageList" :key="index" :message="message"/>
		</section>
		
		<MessageEditor class="editor" @send-message="addMessage"/>
	</div>
</template>

<script>
export default {
	name: "Conversation",
	middleware: "autenticated",
	data(){
		return {
			currentUser : {
				id:0,
				pseudo:"Robotechnic",
				image:"/usersImages/default.png"
			}
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
	mounted(){
		this.$store.dispatch("user/updateFromLocalSorage")
		this.scrollToBottom()
	},
	methods:{
		userFromId(id){	// get user data from his id
			if (id === -1) return this.currentUser
			else {
				return this.friends.filter(user => user.id === id)[0]
			}
		},
		addMessage(message){
			this.messages.push({
				userId:-1,
				text:message
			})
		},
		scrollToBottom() {
			if (this.$refs.messageDisplay){
				this.$refs.messageDisplay.scrollTop = this.$refs.messageDisplay.scrollHeight
			}
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