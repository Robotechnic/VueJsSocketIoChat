<template>
	<nav class="searchBar">
		<input 
			type="text"
			class="searchBar__input" 
			placeholder="Search for a friend" 
			v-model="searchText"
			@focus="displayResult = true" 
			@blur="displayResult = false"
			@input="searchForResult"
		>
		<ul class="searchBar__result" :class="{visible: displayResult}">
			<li v-if="error">"An error append"</li>
			<li v-else-if="searchText.length < minLenght">{{ defaultResult }}</li>
			<li v-else-if="results.length == 0">{{ noResult }}</li>
			<li 
				v-else
				v-for="result,index in results"
				:key="index"
				class="searchBar__result__user"
				@mousedown="processResult(result)"
			>
				<slot :result="result"></slot>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	props: {
		defaultResult: {
			type: String,
			default:""
		},
		noResult: {
			type: String,
			default: "No result"
		},
		requestUrl: {
			type: String,
			required: true
		},
		searchField: {
			type: String,
			default: "search"
		},
		minLenght: {
			type: Number,
			default: 3
		},
		searchDelay: {
			type: Number,
			default: 1000
		}
	},
	data() {return {
		displayResult:false,
		lastSearch: Date.now(),
		searchTimeout: -1,
		searchText: "",
		results: [],
		error: false
	}},
	methods: {
		async searchForResult() {
			if (this.searchTimeout > 0) {
				clearTimeout(this.searchTimeout)
			}

			if (this.searchText.length < this.minLenght) {
				return
			}

			if (Date.now() - this.lastSearch >= this.searchDelay) {
				this.lastSearch = Date.now()
				const send = Object()
				send[this.searchField] = this.searchText
				send.token = this.$store.state.user.accessToken
				const {json, error} = await this.$customFetch(this.requestUrl,send)

				if (!error) {
					this.results = json
					return
				}
				
				this.error = this.$errorManager(json).errorCaptured
				return
			}

			this.searchTimeout = setTimeout(this.searchForResult,this.searchDelay + 100)
		},

		processResult(result){
			this.$emit("newResult",result)
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/colors";
.searchBar {
	width: 80%;
	position: relative;
	&__input {
		width: 100%;
	}

	&__result {
		width: 100%;
		position: absolute;
		max-height: 40vh;
		background-color: $inputBackground;
		color: $inputColor;
		border: 1px solid $inputBorder;
		padding: 8px 7px;
		font-size: 16px;
		box-sizing: border-box;
		margin: 2px 0px;
		border-radius: 5px;
		line-height: 1.5;
		list-style-type: none;

		visibility: hidden;
		&.visible {
			visibility: visible;
			overflow-y: auto;
		}

		&__user {
			display: flex;
			align-items: center;
			justify-content: left;
			cursor: pointer;

			&:hover {
				background-color: lighten($color: $inputBackground, $amount: 10);
				color: lighten($color: $inputColor, $amount: 25);
			}

			&__userImage {
				width: 2em;
				height: 2em;
				margin-right: 10px;
			}
		}
	}
}
</style>