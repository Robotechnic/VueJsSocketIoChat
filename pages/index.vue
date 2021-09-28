<template>
	<div class="chatContener">
		<header>
			<h1 class="header__title">NuxtChat</h1>
		</header>
		<Friends :userId="$store.state.user.userId" ref="friends" @fetchEnd="getConnectedFriends"/>
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
				auth: {
					token : this.$store.state.user.accessToken
				}
			})
		}
	},
	computed: {
		messageList(){ // get message list populated with user data
			const result = []
			
			for (const i in this.messages){
				result.push({
					text: this.messages[i].text,
					user: this.userFromId(this.messages[i].userId)
				})
			}
			return result
		}
	},
	mounted(){
		this.socket.on("connect",()=>{
			console.log("Connected to the server")
		})

		this.socket.on("error",()=>{
			console.error("Socket error")
		})

		this.socket.on("connect_error",(err)=>{
			console.error("Connexion Error", err.message)
		})

		this.socket.on("status",(status)=>{
			console.log(status)
			status.forEach((status)=>{
				this.$refs.friends.updateUserStatus(status)
			})
		})

		this.socket.on("message",(message)=>{
			this.$refs.messagesView.addMessage({
				message: message.message,
				creation: Date.now(),
				userId: message.from
			})
		})
	},
	methods:{
		sendMessage(message) {
			this.socket.emit("message",this.$store.state.user.accessToken,{
				message,
				to: this.$refs.messagesView.friend.userId ?? 0
			})
			this.$refs.messagesView.addMessage({
				message,
				creation: Date.now(),
				userId: this.$store.state.user.userId
			})
		},

		getConnectedFriends() {
			this.socket.emit('getConnectedSockets',this.$store.state.user.accessToken)
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
	grid-template-columns: max-content 1fr;
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