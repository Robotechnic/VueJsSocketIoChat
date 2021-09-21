<template>
	<section ref="messageDisplay" class="messageDisplay">
		<p v-if="hasFriend && !err" class="messageDisplay__start" >
			This is the begining of this conversation with {{ friend.pseudo }}
			<br/>
			To start, you just need to type a message in the area on the bottom.
		</p>
		<p v-else-if="!hasFriend">
			This is not your friend ;(
		</p>
		<p v-else>
			An error appened, please try again
		</p>
		<Message v-for="message,index in messageList" :key="index" :message="message"/>
	</section>
</template>

<script>
export default {
	data() { return {
		friend: {},
		messageList: [],
		hasFriend:true,
		err: false
	}},

	async fetch() {
		const {json, err} = await this.$customFetch("/api/friends/hasFriend",{
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
			// return
		}

		// const {jsonMessages, messagesErr} = await this.$customFetch("/api/friends/hasFriend",{
		// 	friendId: this.$route.params.conversation,
		// 	token: this.$store.state.user.accessToken
		// })

		// if (messagesErr) {
		// 	this.err = true
		// 	return
		// }

		// this.messageList = jsonMessages
	},

	watch:{
		$route (to, from){
			this.$fetch()
		}
	}
}
</script>