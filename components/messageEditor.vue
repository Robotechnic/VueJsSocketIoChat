<template>
	<div class="editor">
		<textarea 
			v-model="message"
			class="editor__textArea textContener"
			@keydown.enter="sendMessage"
		></textarea>
		<!-- eslint-disable vue/no-v-html -->
		<div 
			class="editor__result textContener"
			v-html="markdown"
		>
		</div>
		<!-- eslint-enable -->
	</div>
</template>

<script>
export default {
	name:"Editor",
	props:{
		receiver:{
			type:String,
			default:""
		}
	},
	emits:[
		"send-message"
	],
	data() {return{
		message:"",
		forbidenKeys:[
			"Shift",
			"Backspace",
			"CapsLock",
			"Control",
			"ArrowRight",
			"ArrowLeft",
			"ArrowTop",
			"ArrowBottom"
		]
	}},
	computed: {
		markdown() {
			return this.message
				.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<i>*$1*</i>")
				.replace(/__([^_]+)__/g, "<i>__$1__</i>")
				.replace(/\*\*([^*]+)\*\*/g, "<b>**$1**</b>")
				.replace(/(?<!_)_([^_]+)_(?!_)/g, "<u>_$1_</u>")
				.replace(/-([^-]+)-/g, "<s>-$1-</s>")
				.replace(/ /g,"&nbsp;")
				.replace(/\t/g,"&tab;")
				.replace(/\n/g,"<br/>")
				+ "&nbsp;"
		}
	},
	watch:{
		receiver(newVal, oldVal){
			this.setPlaceholder(newVal)
		}
	},
	beforeMount(){
		this.setPlaceholder(this.receiver)
	},
	methods:{
		sendMessage(event){
			if (!event.shiftKey && this.message.length > 0){
				event.preventDefault()
				this.$emit("send-message",this.message)
				this.message = ""
			}
		},
		setPlaceholder(receiver){
			if (receiver !== "")
				document.documentElement.style.setProperty('--placeholder', `"Send message to ${receiver}"`)
			else
				document.documentElement.style.setProperty('--placeholder', `"Type your message here"`)
		}
	}
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/colors";
:root {
	--placeholder: "Type your message here";
}

.editor {
	border-top-left-radius: 10px;
	background: $elementsBackground;
	min-height: 4em;
	max-height: 6em;
	position: relative;
	overflow-y: scroll;
	padding: 2px;

	&__result {
		position: absolute;
		width: min-content;
		z-index:1;
	}

	&__textArea {
		position: absolute;
		resize: none;
		color: transparent;
		caret-color:$textColor;
		background: transparent;
		border: none;
		width: 99%;
		outline:none;
		z-index:2;

		&:empty::before {
			content: var(--placeholder);
			color: darken($color: $textColor, $amount: 50);
			pointer-events: none;
		}
	}

	.textContener {
		margin: 0px;
		height: max-content;
		line-height: 1.1em;
		tab-size: 1.5;
		padding: 5px 10px;
	}
}
</style>