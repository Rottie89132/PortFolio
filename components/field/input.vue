<template>
	<field :name="name" v-slot="{ field, meta }">
		<label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
		<input :placeholder="value" :class="['btn-Input mt-2 mb-5', meta.touched && !meta.valid ? 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none' : '']" :ref="type" :type="type" v-bind="field" :aria-label="type" :autocomplete="label == 'email' || label == 'Gebuikersnaam' ? `current-${probs.type}` : `new-${probs.type}`" />
		<ErrorMessage class="mb-1 -mt-3 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
	</field>
</template>

<script setup lang="ts">
	const probs = defineProps({
		type: { type: String, default: "text" },
		label: { type: String, default: "Input" },
		name: { type: String, default: "Input" },
		value: { type: String, default: "" },
	});
</script>
