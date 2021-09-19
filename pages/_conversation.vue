<template>
	<div class="chatContener">
		<header>
			<h1 class="header__title">NuxtChat</h1>
		</header>
		<nav class="friends">
			<h2 class="friends__title">Friends</h2>
			<p v-if="friends.length == 0">You doesn't have any friends yet ;(</p>
			<User v-for="friend, index in friends" v-else :key="index" :user="friend"/>
		</nav>
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
	name: "conversation",
	middleware: "autenticated",
	data(){
		return {
			currentUser : {
				id:0,
				pseudo:"Robotechnic",
				image:"/usersImages/default.png"
			},
			friends:[
				{
					id:1,
					pseudo:"Hello",
					image:"/usersImages/default.png",
					status:1
				},
				{
					id:2,
					pseudo:"Never here",
					image:"/usersImages/default.png",
					status:0
				}
			],
			messages:[
				{
					userId:1,
					text:"Hello, I'm Hello, how are you?"
				},
				{
					userId:-1,
					text:"Hy, I'm fine and you"
				},
				{
					userId:1,
					text:"Fine too. Do you enjoy this chat?"
				},
				{
					userId:-1,
					text:"Yes of course"
				},
				{
					userId:1,
					text:"Hello, I'm Hello, how are you?"
				},
				{
					userId:-1,
					text:"Hy, I'm fine and you"
				},
				{
					userId:1,
					text:"Fine too. Do you enjoy this chat?"
				},
				{
					userId:1,
					text:"Yes of course"
				}
			]
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
		this.scrollToBottom()
	},
	methods:{
		userFromId(id){	// get user data from his id
			if (id === -1) return this.currentUser
			else {
				return this.friends.filter(user => user.id === id)[0]
			}
		},
		addMessage(messageText){
			this.messages.push({
				userId:-1,
				text:messageText
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

.friends {
	grid-area:friend;
	padding: 5px 10px;
	background:$elementsBackground;
	border-left:2px solid $secondaryColor;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;

	&__title {
		margin-bottom: 2px;
		border-bottom: 1px solid $textColor;
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