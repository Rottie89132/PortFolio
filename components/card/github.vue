<template>
	<div class="delay-100 last:mb-0 animate-fade-in">
		<div v-if="item.loaded" class="p-3 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
			<div class="flex items-center gap-2">
				<NuxtImg draggable="false" :src="item.owner.avatar_url" class="w-5 rounded-full"> </NuxtImg>
				<h3 class="font-semibold dark:text-white">{{ item.full_name }}</h3>
			</div>
			<p class="mt-3 md:mt-1 whitespace-pre-wrap text-balance dark:text-white mr-5 leading-[1.2rem] text-sm break-words opacity-70 line-clamp-2">
				{{ item.description || defaultDescription }}
			</p>
			<div class="flex items-center gap-3 mt-3 mb-1 font-semibold">
				<button v-if="item.saved" @click="DeleteRepo(item)" class="flex items-center justify-center font-semibold px-3 py-1 text-xs dark:text-black dark:bg-white dark:ring-white text-white bg-neutral-800 rounded ring-2 ring-neutral-800 dark:hover:bg-gray-50 dark:hover:ring-gray-50 hover:bg-neutral-900 hover:ring-neutral-900">Verwijderen</button>
				<button v-else @click="SaveRepo(item)" class="flex items-center justify-center font-semibold px-3 py-1 text-xs dark:text-black dark:bg-white dark:ring-white text-white bg-neutral-800 rounded ring-2 ring-neutral-800 dark:hover:bg-gray-50 dark:hover:ring-gray-50 hover:bg-neutral-900 hover:ring-neutral-900">Toevoegen</button>

				<button v-if="item.saved" @click="UpdateRepo(item)" class="p-[0.33em] rounded-md text-xs flex justify-center items-center font-semibold dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200 dark:hover:bg-neutral-700 dark:hover:ring-neutral-700 hover:bg-neutral-300 hover:ring-neutral-300">
					<Icon name="material-symbols:feature-search" size="1.4em"></Icon>
				</button>

				<NuxtLink :to="`/dashboard/repos/issues/${item.name}`" v-if="item.open_issues_count > 0" class="p-[0.33em] rounded-md text-xs flex justify-center items-center font-semibold dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200 dark:hover:bg-neutral-700 dark:hover:ring-neutral-700 hover:bg-neutral-300 hover:ring-neutral-300">
					<Icon name="material-symbols:release-alert" size="1.4em"></Icon>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const defaultDescription = "Dit project heeft geen beschrijving";

	const { item, SaveRepo, DeleteRepo, UpdateRepo } = defineProps<{
		item: any;
		SaveRepo: (item: any) => void;
		DeleteRepo: (item: any) => void;
		UpdateRepo: (item: any) => void;
	}>();
</script>
