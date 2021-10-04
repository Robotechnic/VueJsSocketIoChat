<template>
	<div class="friendManager">
		<SearchBar 
			class = "friendManager__friendSearch" 
			defaultResult = "Please type at least 3 character."
			requestUrl = "/api/friends/search"
			searchField = "pseudo"
			@newResult="sendFriendRequest"
		>
			<template #default="slotProps">
				<User :user="slotProps.result"/>
			</template>
		</SearchBar>
		<div class="friendManager__requestContener">
			<RequestManager ref="getDemands" url="/api/friends/getDemands" :userId="$store.state.user.userId" title="Incoming Friend requests" >
				<template #default="slotProps">
					<ConfirmUser 
						:user="slotProps.request"
						@cancel="cancelDemands(slotProps.request.id)"
						@accept="acceptDemands(slotProps.request.id)"
					/>
				</template>
			</RequestManager>

			<RequestManager ref="getRequests" url="/api/friends/getRequests" :userId="$store.state.user.userId" title="Pending Friend requests">
				<template #default="slotProps">
					<BaseUser :user="slotProps.request"/>
				</template>
			</RequestManager>
		</div>
	</div>
</template>

<script>
export default {
	head() {return {
		title:"NuxChat - Friends"
	}},
	data() { return {
		err: false
	}},
	methods: {
		async sendFriendRequest(searchResult) {
			const {json,error} = await this.$customFetch("/api/friends/sendrequest",{
				...searchResult,
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				this.updateFriendsRequest()
			}
			const {code, errorCaptured} = this.$errorManager(json)

			if (code === "ALREALY_FRIEND") {
				alert("This is alrealy your friend or you have a pending request with him")
				return
			}

			if (code === "DUPLICATE_FRIEND_REQUEST") {
				alert("You have a pending request with him")
				return
			}

			this.error = errorCaptured
		},

		updateFriendsRequest() {
			this.$refs.getDemands.update()
			this.$refs.getRequests.update()
		},

		async cancelDemands(requestId) {
			const {json,error} = await this.$customFetch("/api/friends/cancelRequest",{
				requestId,
				token:this.$store.state.user.accessToken
			})

			if (!error) {
				await this.updateFriendsRequest()
			}

			this.error = this.$errorManager(json).errorCaptured
		},

		async acceptDemands(requestId) {
			const {json,error} = await this.$customFetch("/api/friends/acceptRequest",{
				requestId,
				token:this.$store.state.user.accessToken
			})

			if (!error) {
				await this.updateFriendsRequest()
			}

			this.error = this.$errorManager(json).errorCaptured
		}
	}
}
</script>

<style lang="scss" scoped>
.friendManager {
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-items: center;
	padding: 10px;

	&__requestContener {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10vw;
	}
}
</style>
