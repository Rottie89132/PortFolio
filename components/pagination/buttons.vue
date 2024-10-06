<template>
	<div v-if="items.length > 0 && hidebuttons.total > 1" class="flex items-center gap-2">
		<button id="Vorige" aria-label="Vorige" v-if="hidebuttons.page > 1" :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="PreviousPage">
			<Icon name="material-symbols:keyboard-arrow-left" size="1.2em"></Icon>
		</button>
		<button id="Volgende" aria-label="Volgende" v-else :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="NextPage">
			<Icon name="material-symbols:keyboard-arrow-right" size="1.2em"></Icon>
		</button>
		<button id="LastVorige" aria-label="Volgende" v-if="hidebuttons.page > 1" :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="NextPage">
			<Icon :name="hidebuttons.page >= hidebuttons.total ? 'material-symbols:keyboard-double-arrow-left' : 'material-symbols:keyboard-arrow-right'" size="1.2em"></Icon>
		</button>
		<button id="LastVolgende" aria-label="Vorige" v-else :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="PreviousPage">
			<Icon :name="hidebuttons.page <= 1 ? 'material-symbols:keyboard-double-arrow-right' : 'material-symbols:keyboard-arrow-left'" size="1.2em"></Icon>
		</button>

		<form @submit.prevent="navigateToPage">
			<input v-model="currentPage" name="page" id="Search" type="number" aria-label="Search" class="p-[0.34rem] ring-2 ring-[#e8e8e8] dark:ring-[#1a1a1a] dark:bg-[#111111] dark:text-white appearance-none w-9 text-center font-medium bg-[#F7F7F7] flex items-center justify-center rounded-xl" />
		</form>
	</div>
</template>

<script setup lang="ts">
	const { items, hidebuttons, loading, currentPage, PreviousPage, NextPage, navigateToPage } = defineModels<{
		items: any;
		hidebuttons: any;
		loading: boolean;
		currentPage: number | string;
		PreviousPage: () => void;
		NextPage: () => void;
		navigateToPage: () => void;
	}>();
</script>
