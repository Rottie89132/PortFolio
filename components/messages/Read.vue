<template>
	<div class="relative group">
		<div class="px-[0.45em] rounded-md py-1 text-xs flex justify-center items-center font-semibold dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200">
			<Icon :name="PostRead ? 'material-symbols:mark-email-read-outline' : 'material-symbols:mark-email-unread-outline'" size="1.3em"></Icon>
		</div>
		<div v-if="!PostRead" class="absolute -ml-[0.15em] text-center w-40 -top-[0.8em] transform -translate-y-full dark:bg-indigo-500 bg-indigo-600 text-white text-xs rounded-md py-1 px-2 hidden group-hover:block transition duration-200 ease-in-out">
			<p class="text-center p-[0.45em] z-20 dark:bg-indigo-500 bg-indigo-600">
				<span class="font-semibold"> Bericht niet gelezen! </span>
			</p>
			<div class="absolute w-3 h-3 dark:bg-indigo-500 bg-indigo-600 transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
		</div>
		<div v-else class="absolute -ml-[0.15em] text-center w-36 -top-[0.8em] transform -translate-y-full dark:bg-indigo-500 bg-indigo-600 text-white text-xs rounded-md py-1 px-2 hidden group-hover:block transition duration-200 ease-in-out">
			<p class="text-center p-[0.45em] z-20 dark:bg-indigo-500 bg-indigo-600">
				<span class="font-semibold"> Bericht is gelezen! </span>
			</p>
			<div class="absolute w-3 h-3 dark:bg-indigo-500 bg-indigo-600 transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
		</div>
	</div>
</template>

<script setup>
	const probs = defineProps({
		PostRead: Boolean,
	});
</script>
