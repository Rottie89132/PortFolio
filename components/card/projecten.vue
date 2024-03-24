<template>
	<div class="delay-100 last:mb-0 animate-fade-in">
		<div v-if="item.loaded" class="p-3 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
			<div class="flex items-center gap-2">
				<NuxtImg draggable="false" :alt="item.owner.avatar_url" :src="item.owner.avatar_url" class="w-5 rounded-full"> </NuxtImg>
				<h2 class="font-semibold dark:text-white">{{ item.full_name }}</h2>
			</div>
			<p class="mt-2 mr-5 text-balance text-sm whitespace-pre-wrap break-words opacity-70 md:line-clamp-2 line-clamp-3 dark:text-white">
				{{ item.description || defaultDescription }}
			</p>
			<div class="flex items-center gap-3 mt-2 overflow-scroll font-bold">
				<div v-if="item.topics.length >= 1" v-for="topics in item.topics">
					<p class="dark:text-white text-sm text-[0.83em]">{{ topics }}</p>
				</div>
				<div v-else>
					<p class="dark:text-white">{{ noTags }}</p>
				</div>
			</div>
			<div class="flex items-center gap-3 justify-between font-semibold select-none">
				<div class="flex items-center gap-3">
					<a v-if="item.homepage && !disableLink" :href="item.homepage" target="_blank" class="flex items-center justify-center px-3 py-1 mt-3 mb-1 text-xs dark:text-black dark:bg-white font-semibold dark:ring-white text-white bg-black rounded ring-2 ring-black">Bezoeken</a>
					<div v-else-if="item.homepage" class="relative group">
						<a class="flex items-center justify-center px-3 py-1 mt-3 mb-1 text-xs dark:text-black dark:bg-white font-semibold dark:ring-white text-white bg-black rounded ring-2 ring-black"> Bezoeken </a>
						<div class="absolute -ml-[0.15em] text-center w-48 -top-[0.12em] transform -translate-y-full dark:bg-indigo-500 bg-indigo-600 text-white text-xs rounded-md py-1 px-2 hidden group-hover:block transition duration-200 ease-in-out">
							<p class="text-center p-[0.45em] z-20 dark:bg-indigo-500 bg-indigo-600">
								<span class="font-semibold"> Je bent al op deze website! </span>
							</p>
							<div class="absolute w-3 h-3 dark:bg-indigo-500 bg-indigo-600 transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
						</div>
					</div>

					<a v-if="item.visibility == 'public'" :href="item.html_url" target="_blank" class="flex items-center justify-center gap-1 px-[0.6rem] py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200"> <Icon name="tabler:brand-github-filled" size="1.2em"></Icon>GitHub </a>
					<div v-else class="relative group">
						<a class="flex items-center justify-center gap-1 px-[0.6rem] dark:bg-neutral-800 dark:ring-neutral-800 py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200 cursor-not-allowed"> <Icon name="tabler:brand-github-filled" size="1.2em"></Icon>GitHub </a>
						<div class="absolute -ml-[0.15em] text-center w-36 -top-[0.12em] transform -translate-y-full dark:bg-indigo-500 bg-indigo-600 text-white text-xs rounded-md py-1 px-2 hidden group-hover:block transition duration-200 ease-in-out">
							<p class="text-center p-[0.45em] z-20 dark:bg-indigo-500 bg-indigo-600">
								<span class="font-semibold">Dit project is privé!</span>
							</p>
							<div class="absolute w-3 h-3 dark:bg-indigo-500 bg-indigo-600 transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
						</div>
					</div>
				</div>
				<liked :url="item.html_url" :visibility="item.visibility" :name="item.name" :id="item.repo_id" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const defaultDescription = "Dit project heeft geen beschrijving";
	const noTags = "Dit project heeft geen tags";
	const disableLink = ref();

	const { item } = defineProps<{
		item: any;
	}>();

	if (process.client) {
		disableLink.value = item.homepage == location.origin;
	}
</script>
