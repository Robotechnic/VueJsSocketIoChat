<template>
	<section ref="messageDisplay" class="messageDisplay">
		<p v-if="err" class="messageDisplay__error">
			An error appened, please try again
		</p>
		<p v-else-if="hasFriend && allMessagesLoaded" class="messageDisplay__start" >
			This is the begining of this conversation with {{ friend.pseudo }}
			<br/>
			To start, you just need to type a message in the area on the bottom.
		</p>
		<p v-else-if="!hasFriend" class="messageDisplay__notFriend">
			This is not your friend ;(
		</p>
		<div v-else ref="loader" class="messageDisplay__loading">
			<img src="@/assets/images/wait.svg" />
		</div>
		<Message 
			v-for="message in messages" 
			:key="message.id"
			:ref="'message'+message.id"
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
		err: false,
		allMessagesLoaded:false,
		intersectionObserver:null
	}},

	async fetch() {
		const {json, error} = await this.$customFetch("/api/friends/hasFriend",{
			friendId: this.$route.params.conversation,
			token: this.$store.state.user.accessToken
		})

		if (!error) {
			this.friend = json.friend
			if (!json.hasFriend) {
				this.hasFriend = false
				return
			}
		} else {
			const {errorCaptured} = this.$errorManager(json)
			if (errorCaptured) {
				this.error = true
				return
			}
		}

		this.getLastMessages()
	},

	mounted(){
		this.intersectionObserver = new IntersectionObserver(this.loadBeforeMessages,{
			root: this.$refs.messageDisplay,
			rootMargin:"0px",
			threshold: 0.2
		})
	},

	updated(){
		if (this.messages.length > 0 && !this.err && this.hasFriend && !this.allMessagesLoaded) {
			this.intersectionObserver.observe(this.$refs.loader)
		} else if (this.$refs.loader){
			this.intersectionObserver.unobserve(this.$refs.loader)
		}
	},

	watch:{
		$route (to, from){
			this.$fetch()
		}
	},

	methods: {
		async getLastMessages(){
			const {json, error} = await this.$customFetch("/api/messages/lastMessages",{
				friendId: this.$route.params.conversation,
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				if (json.totalMessages < 10) {
					this.allMessagesLoaded = true
				}
				this.messages = json.messages
				this.$nextTick(()=>{
					this.scrollToBottom()
				})
			}

			this.error = this.$errorManager(json).errorCaptured
		},
		async loadBeforeMessages(entries, observer) {
			if (!entries[0].isIntersecting) {
				return
			}

			console.log(entries[0])

			const {json, error} = await this.$customFetch("/api/messages/messagesBefore",{
				friendId: this.$route.params.conversation,
				messageId: this.messages[0].id,
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				if (json.totalMessages < 10) {
					this.allMessagesLoaded = true
				}
				this.messages = json.messages.concat(this.messages)

				await this.$nextTick()

				this.$refs[`message${this.messages[json.totalMessages].id}`][0].$el.scrollIntoView()
			}

			this.error = this.$errorManager(json).errorCaptured
		},
		scrollToBottom() {
			if (this.$refs.messageDisplay){
				this.$refs.messageDisplay.scrollTop = this.$refs.messageDisplay.scrollHeight
			}
		},
		addMessage(message){
			if (message.userId === this.friend.userId || message.userId === this.$store.state.user.userId) {
				this.messages.push(message)
				if (this.$refs.messageDisplay.scrollHeight - this.$refs.messageDisplay.scrollTop < 500)
					this.$nextTick(()=>{
							this.scrollToBottom()
					})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
p {
	padding: 0px 30px;
}

.messageDisplay {
	&__start {
		margin-left: 20px;
		margin-right: 20px;
	}

	&__loading {
		display: flex;
		justify-content: center;
	}
}
</style> 