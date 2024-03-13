<template>
	<div class="flex items-center gap-2 dark:text-white" v-if="loadingIndicater || loading"><icon name="mingcute:loading-fill" class="animate-spin" size="1.4em"></icon>Repositories worden ingeladen</div>
	<div v-else-if="items.length < 1">
		<p class="opacity-75 mb-6 dark:text-white text-sm">Helaas zijn er nog geen repositories beschikbaar. Kom later nog eens terug.</p>
	</div>
	<div v-else-if="Repositories && Repositories.length < 1" class="mb-[5.2em] -mt-2">
		<p class="opacity-75 mb-6 dark:text-white text-sm">Voordat u verder gaat, moet u eerst een verbinding maken met uw GitHub-account.</p>
		<a href="https://github.com/apps/rottie-portfolio/installations/new" target="_blank" class="px-4 py-2 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600"> Maak verbinding </a>
	</div>

	<div v-else-if="Repositories && Repositories.length >= 1" class="p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform">
		<div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
			<div v-for="(item, index) in items" :key="index" class="mb-3">
				<CardGithub :item="item" :DeleteRepo="(item: any) => DeleteRepo?.(item)" :SaveRepo="(item: any) => SaveRepo?.(item)" />
			</div>
		</div>
	</div>
	<div v-else class="p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform">
		<div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
			<div v-for="(item, index) in items" :key="item.repo_id" class="mb-3">
				<CardProjecten :item="item" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { items, loadingIndicater, loading, Repositories, DeleteRepo, SaveRepo } = defineProps<{
		items: any;
		loadingIndicater: boolean;
		loading?: boolean;
		Repositories?: any;
		DeleteRepo?: (item: any) => void;
        SaveRepo?: (item: any) => void;
	}>();
</script>
