<template>
	<div class="chatContener">
		<header>
			<h1>NuxtCHat</h1>
		</header>
		<nav class="friends">

		</nav>
		<section v-if="!$route.params.conversation" class="homePresentation">
			<h1>Home</h1>
			<p v-if="logged && !waiting">Status : logged</p>
			<p v-else-if="waiting">Status : waiting</p>
			<p v-else>Status : not logged</p>
			<p>Token : {{token}}</p>
			<p>Timeout : {{timeout}}</p>

			<button @click="login">login</button>
			<button @click="refresh">refresh</button>
			<button @click="logout">logout</button>
		</section>
		
	</div>
</template>

<script>
import Messages from "../components/messages.vue"
export default {
	components:[
		Messages
	],
	data(){
		return {
			token:null,
			logged:false,
			waiting:false,
			timeout:0
		}
	},
	methods:{
		setNewTimeout(){
				clearTimeout(this.timeout)
				this.timeout = setTimeout(this.refresh,10000)
		},
		login(){
			this.waiting = true
			this.logged = false
			fetch("http://localhost:8080/api/user/login",{
				method:"POST",
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					pseudo: "test",
					password: "aA123456789@"
				})
			}).then(response=>response.json()).then(json=>{
				console.log("Login")
				console.log(json)
				this.token = json.token
				this.waiting = false
				this.logged = true
				this.setNewTimeout()
			})
		},
		refresh(){
			this.waiting = true
			fetch("http://localhost:8080/api/user/refresh",{
				method:"POST"
			}).then(response=>response.json()).then(json=>{
				console.log("Refresh")
				console.log(json)
				this.waiting = false

				if (json.error){
					console.log("Error, disconnect")
					this.logged = false
				} else {
					this.token = json.token
					this.setNewTimeout()
				}
			})
		},
		logout(){
			console.log("logout")
			this.waiting = true
			clearTimeout(this.timeout)
			fetch("http://localhost:8080/api/user/logout",{
				method:"POST",
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token:this.token
				})
			}).then(response=>response.json()).then(json=>{
				console.log(json)
				this.waiting = false
				this.logged = false
			})
		}
	}
}
</script>
