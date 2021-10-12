<template>
<div class="friends">
	<h2 class="friends__title">Friends</h2>
	<NumberDisplay :number="requests">
		<nuxt-link to="/friendsManager" class="friends__managerLink button">
			Manage friends
		</nuxt-link>
	</NumberDisplay>
	<p v-if="friends.length == 0 && !error">
		You doesn't have any<br/>friends yet ;(
	</p>
	<p v-else-if="error">
		A fatal error append retry later
	</p>
	<div v-else class="friends__friends">
		<User v-for="friend, index in friends" :key="index" :user="friend"/>
	</div>
</div>
</template>

<script>
export default {
	name: "Friends",
	props: {
		userId: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			friends: [],
			requests: 0,
			error:false
		}
	},
	async created() {
		await this.$store.dispatch("user/updateFromLocalSorage")
		await this.fetch()
		this.$emit("fetchEnd")
	},
	methods: {
		async fetch() {
			this.requestCount()
			const {json,error} = await this.$customFetch("/api/friends/userFriends",{
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				json.forEach(element => {
					element.status = "disconnected"
				})
				this.friends = json
				return
			}
			
			this.error = this.$errorManager(json).errorCaptured
		},

		async requestCount() {
			const {json, error} = await this.$customFetch("/api/friends/getDemands",{
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				this.requests = json.length
			}

			this.error = this.$errorManager(json).errorCaptured
		},

		updateUserStatus(status) {
			const userId = this.friends.findIndex(element => element.userId === status.userId)
			this.$set(this.friends,userId,{
				...this.friends[userId],
				status: status.status
			})
		}
	}
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/colors";
.friends {
	grid-area: friend;
	padding: 5px 10px;
	background:$elementsBackground;
	border-left:2px solid $secondaryColor;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	overflow-y: auto;
	overflow-x: hidden;

	&__title {
		margin-bottom: 15px;
		border-bottom: 1px solid $textColor;
	}

	&__firends {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-width: 185px;
	}

	&__managerLink {
		margin: 10px 5px;
	}
}
</style>