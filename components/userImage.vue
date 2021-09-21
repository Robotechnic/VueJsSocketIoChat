<template>
	<img :src="avatar"/>
</template>

<script>
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';
export default {
	props: {
		pseudo: {
			type: String,
			required: true
		}
	},
	computed: {
		avatar(){
			return createAvatar(style, {
				seed: this.pseudo,
				radius: 30,
				dataUri: true,
				background: "white"
			})
		}
	}
}
</script>