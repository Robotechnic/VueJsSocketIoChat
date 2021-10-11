<template>
	<div class="chatContener">
		<Header class="chatContener__header"/>
		<Friends ref="friends" :userId="$store.state.user.userId" @fetchEnd="getConnectedFriends"/>
		<nuxt-child ref="messagesView" class="mainContent"/>
		<MessageEditor 
			class="editor"
			:class="{display : $route.params.conversation }"
			@send-message="sendMessage"
			/>
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

		this.socket.on("error",(error)=>{
			console.error("Socket error",error)
		})

		this.socket.on("connect_error",(err)=>{
			console.error("Connexion Error", err.message)
		})

		this.socket.on("status",(status)=>{
			console.log(status)
			this.$nextTick(()=>{
				status.forEach((status)=>{
					this.$refs.friends.updateUserStatus(status)
				})
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

	&__header {
		grid-area:header;
	}
}

.mainContent {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	grid-area:main;
	overflow-y: scroll;
	background:$elementsBackground;
}

.editor {
	grid-area:editor;
	display: none;
	&.display {
		display: block;
	}
}

</style>