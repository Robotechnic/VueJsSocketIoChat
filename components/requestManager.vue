<template>
	<div class="requestManager">
		<div class="requestManager__request">
			<h2 class="requestManager__request__title">
				{{ title }}
			</h2>
			<div v-if="error" class="requestManager__request__error">
				<p> An error appened</p>
			</div>
			<div v-else-if="requestsList.length == 0" class="requestManager__request__noRequest">
				<p>No requests</p>
			</div>
			<ul v-else class="requestManager__request__requestList">
				<li v-for="request, index in requestsList" :key="index" class="requestManager__request__requestList__element">
					<slot :request="request"/>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		url: {
			type: String,
			required: true
		},
		userId: {
			type: Number,
			required: true
		},
		title :{
			type: String,
			required: true
		}
	},
	mounted() {
		this.update()
	},
	data() {return {
		requestsList: [],
		error: false
	}},
	methods : {
		async update() {
			const {json, error} = await this.$customFetch(this.url,{
				userId: this.userId,
				token: this.$store.state.user.accessToken
			})

			if (!error) {
				this.requestsList = json
				return
			}

			this.error = this.$errorManager(json).errorCaptured
		}
	}
}
</script>

<style lang="scss" scoped>
.requestManager {
	display: flex;
	justify-content: center;
	overflow-y: auto;

	&__request {
		&__requestList {
			list-style-type: none;
			padding: 0px 10px;

			&__element {
				margin: 10px 0px;
			}
		}
	}
}
</style>