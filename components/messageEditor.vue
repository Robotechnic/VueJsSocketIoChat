<template>
	<div class="editor" contenteditable="true" @keyup="formater" @keydown.enter="sendMessage">

	</div>
</template>

<script>
export default {
	name:"Editor",
	beforeMount(){
		console.log("Ok")
		this.setPlaceholder(this.receiver)
	},
	props:{
		receiver:{
			type:String,
			default:""
		}
	},
	emits:[
		"send-message"
	],
	watch:{
		receiver(newVal, oldVal){
			this.setPlaceholder(newVal)
		}
	},
	methods:{
		formater(event){
			const target = event.target
			
			// reset the input to set the placeholder
			if (target.innerHTML === "<br>" || target.innerHTML === "<br/>"){
				target.innerHTML = ""
				return
			}

			// run the formater
			console.log("Ok")
		},
		sendMessage(event){
			const target = event.target
			if (!event.shiftKey){
				event.preventDefault()
				this.$emit("send-message",target.innerText)
				target.innerHTML = ""
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
:root {
	--placeholder: "Type your message here";
}

.editor {
	border-top-left-radius: 10px;
	padding: 10px 5px;
	background: $elementsBackground;
	min-height:3em;
	max-height:5em;
	overflow-y: scroll;

	&:empty::before {
		content: var(--placeholder);
		color: darken($color: $textColor, $amount: 50);
		pointer-events: none;
	}
}
</style>