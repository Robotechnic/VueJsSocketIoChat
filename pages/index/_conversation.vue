<template>
	<section ref="messageDisplay" class="messageDisplay">
		<p v-if="hasFriend && !err" class="messageDisplay__start" >
			This is the begining of this conversation with {{ friend.pseudo }}
			<br/>
			To start, you just need to type a message in the area on the bottom.
		</p>
		<p v-else-if="!hasFriend" class="messageDisplay__notFriend">
			This is not your friend ;(
		</p>
		<p v-else class="messageDisplay__error">
			An error appened, please try again
		</p>
		<Message 
			v-for="message,index in messages" 
			:key="index" 
			:message="message"
			:user="message.userId === $store.state.user.userId ? {pseudo: $store.state.user.pseudo, id:$store.state.user.userId} : friend"
			/>
	</section>
</template>

<script>
export default {
	data() { return {
		friend: {},
		messages: [],
		hasFriend:true,
		err: false
	}},

	async fetch() {
		let {json, err} = await this.$customFetch("/api/friends/hasFriend",{
			friendId: this.$route.params.conversation,
			token: this.$store.state.user.accessToken
		})

		if (err) {
			this.err = true
			return
		}

		this.friend = json.friend

		if (!json.hasFriend) {
			this.hasFriend = false
			return
		}

		({json, err} = await this.$customFetch("/api/messages/lastMessages",{
			friendId: this.$route.params.conversation,
			token: this.$store.state.user.accessToken
		}))

		if (err) {
			this.err = true
			return
		}

		this.messages = json.messages
		this.$nextTick(()=>{
			this.scrollToBottom()
		})
	},

	watch:{
		$route (to, from){
			this.$fetch()
		}
	},

	methods: {
		scrollToBottom() {
			if (this.$refs.messageDisplay){
				this.$refs.messageDisplay.scrollTop = this.$refs.messageDisplay.scrollHeight
			}
		},
		addMessage(message){
			this.messages.push(message)
			if (this.$refs.messageDisplay.scrollHeight - this.$refs.messageDisplay.scrollTop < 500)
				this.$nextTick(()=>{
						this.scrollToBottom()
				})
		}
	}
}
</script>

<style lang="scss" scoped>
p {
	padding: 0px 30px;
}
</style> 