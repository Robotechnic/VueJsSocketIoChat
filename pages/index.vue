<template>
	<div class="chatContener">
		<header>
			<h1 class="header__title">NuxtChat</h1>
		</header>
		<Friends :userId="$store.state.user.userId" ref="friends"/>
		<nuxt-child ref="messagesView"/>
		<MessageEditor class="editor" @send-message="sendMessage"/>
	</div>
</template>

<script>
const io = require("socket.io-client")

export default {
	name: "Conversation",
	middleware: "autenticated",
	data() {
		return {
			messages: [],
			socket: io(process.env.ORIGIN, {
				query: {
					token :this.$store.state.user.userId
				}
			})
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
	created(){
		this.socket.on("connect",()=>{
			console.log("Connected to the server")
		})

		this.socket.on("error",(err)=>{
			console.error(err)
		})

		this.socket.on("userStatus",this.$refs.updateUserStatus)
	},
	methods:{
		sendMessage(message) {
			this.socket.emit("message",this.$store.state.user.accessToken,message)
			this.$refs.messagesView.addMessage({
				message,
				creation: Date.now(),
				userId: this.$store.state.user.userId
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