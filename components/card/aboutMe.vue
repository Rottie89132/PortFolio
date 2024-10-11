<template>
	<div class="p-3 h-full rounded-lg bg-white dark:bg-neutral-900 dark:text-white">
		<div class="flex items -center justify-between">
			<h2 class="font-extrabold">{{ item.title }}</h2>
			<button @click="toggleCard(item.action)" class="md:hidden">
				<Icon class="dark:text-white text-black" :name="card[item.action] ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4em" />
			</button>
		</div>
		<div v-if="card[item.action]" class="md:hidden ">
			<ClientOnly >
				<AnimatedText :text="item.content" />
			</ClientOnly>
		</div>
		<div class="hidden md:inline">
			<ClientOnly>
				<AnimatedText :text="item.content" />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup lang="ts">

	defineProps<{
		item: Record<string, any>;
		card: any;
		toggleCard: (action: string) => void;
	}>();

</script>
