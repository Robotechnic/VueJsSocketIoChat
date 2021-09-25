<template>
<div class="friends">
	<h2 class="friends__title">Friends</h2>
	<p v-if="friends.length == 0 && !error">
		You doesn't have any friends yet ;(
	</p>
	<p v-else-if="error">
		A fatal error append retry later
	</p>
	<User v-for="friend, index in friends" v-else :key="index" :user="friend"/>
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
			error:false
		}
	},
	async created() {
		await this.$store.dispatch("user/updateFromLocalSorage")
		this.fetch()
	},
	methods: {
		async fetch() {
			const {json,err} = await this.$customFetch("/api/friends/userFriends",{
				token: this.$store.state.user.accessToken
			})
			
			if (!json || err) {
				this.error = true
				return
			}

			if (!json.code) {
				this.friends = json
				return
			}

			switch (json.code) {
				case "INVALID_TOKEN":
				case "EXPIRED_TOKEN":
				case "INVALID_TOKEN_IP":
					this.$store.dispatch("user/logout")
					this.error = true
					break
				case "INTERNAL":
					this.error = true
					break
			}
		},

		updateUserStatus(status) {
			this.friends.filter(element => element.userId === status.userId).status = status.status
		}
	}
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/colors";
.friends {
	grid-area:friend;
	padding: 5px 10px;
	background:$elementsBackground;
	border-left:2px solid $secondaryColor;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	overflow-y: auto;

	&__title {
		margin-bottom: 2px;
		border-bottom: 1px solid $textColor;
	}
}
</style>