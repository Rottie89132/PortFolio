<template>
	<h1 class="md:text-[4.9em] text-[5.2em] dark:text-white text-text-neutral-800 font-extrabold leading-[0.9em]">{{ Title }}</h1>
	<p class="font-medium dark:text-white text-neutral-800 md:w-[70%] md:text-2xl opacity-80 md:pb-4">{{ SubTitle }}</p>
</template>

<script setup lang="ts">
	defineProps({
		Title: { type: String, default: "" },
		SubTitle: { type: String, default: "" },
	});
</script>
