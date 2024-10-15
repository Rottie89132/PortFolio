<template>
	<field :name="name" v-slot="{ field, meta }">
		<div>
			<label class="text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
			<textarea :class="['btn-Input mt-2 mb-5 max-h-44 min-h-20', meta.touched && !meta.valid ? 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none' : '', type == 'content' ? 'h-44' : '']" :ref="type" :type="type" v-bind="field" :aria-label="type" :autocomplete="`current-${probs.type}`"></textarea>
			<ErrorMessage class="mb-1 -mt-4 text-xs text-[#B92538] block" :name="name" />
		</div>
	</field>
</template>

<script setup lang="ts">
	const probs = defineProps({
		type: { type: String, default: "text" },
		label: { type: String, default: "Input" },
		name: { type: String, default: "Input" },
	});
</script>
