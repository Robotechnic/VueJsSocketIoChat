<template>
	<div class="inputGroup">
		<label :for="name" class="inputGroup__label">
			{{ label }}
		</label>
		<input :id="name" :value="value" :type="type" class="inputGroup__input" :name="name" @input="$emit('input',$event.target.value)" />
		<div v-if="value.length > 0" class="inputGroup__validator">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "InputGroup",
	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: String,
			default: ""
		},
		type: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/colors";
.inputGroup {
	display:flex;
	flex-direction: column;
	margin-top: 20px;
}
</style>