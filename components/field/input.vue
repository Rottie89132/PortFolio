<template>
	<field :name="name" v-slot="{ field, meta }">
		<div>
			<label class="block text-base font-bold text-neutral-900" :for="type">{{ label }}</label>
			<div class="flex items-center justify-between gap-2 mt-2 mb-5">
				<div v-if="autoFix" class="flex w-full">
					<input v-if="!blurred" @blur="toggleBlur" :placeholder="placeholder" :class="['btn-Input ', { 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none': meta.touched && !meta.valid }]" :ref="type" :type v-bind="field" :aria-label="type" :autocomplete="autocomplete" />
					<input v-else-if="!showPassword" :placeholder="placeholder" :class="['btn-Input ', { 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none': meta.touched && !meta.valid }]" :ref="type" :type v-bind="field" :aria-label="type" :autocomplete="autocomplete" />
					<input v-else :placeholder="placeholder" :class="['btn-Input ', { 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none': meta.touched && !meta.valid }]" :ref="type" :type="'text'" v-bind="field" :aria-label="type" :autocomplete="autocomplete" />
				</div>
				<div v-else class="flex w-full">
					<input :placeholder="placeholder" :class="['btn-Input ', { 'text-[#B92538] ring-2 ring-[#B92538] outline-none appearance-none border-none': meta.touched && !meta.valid }]" :ref="type" :type="!showPassword ? type : 'text'" v-bind="field" :aria-label="type" :autocomplete="autocomplete" />
				</div>
				<div v-if="type == 'password'" class="flex items-center justify-center p-[0.60rem] text-white bg-neutral-800 rounded-xl" @click="toggleShowPassword">
					<Icon :name="showPassword ? 'ri:eye-line' : 'ri:eye-close-line'" size="1.4rem" />
				</div>
			</div>
			<ErrorMessage class="mb-1 -mt-3 text-xs text-[#B92538] block" :name="name"></ErrorMessage>
		</div>
	</field>
</template>

<script setup lang="ts">
	defineProps({
		type: { type: String, default: "text" },
		label: { type: String, default: "Input" },
		name: { type: String, default: "Input" },
		placeholder: { type: String, default: "" },
		autocomplete: { type: String, default: null },
		autoFix: { type: Boolean, default: false },
	});

	const showPassword = ref(false);
	const blurred = ref(false);

	const toggleShowPassword = () => (showPassword.value = !showPassword.value);
	const toggleBlur = () => (blurred.value = !blurred.value);
</script>
