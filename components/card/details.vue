<template>
	<div class="md:flex justify-between items-center">
		<h1 class="text-[1.5em] leading-7 text-balance select-none text-black dark:text-white font-medium -mb-1">
			Contactverzoek van <span class="font-black truncate">{{ berichten.name }}</span>
			<span class="block text-sm text-neutral-700 dark:text-neutral-300">{{ new Date(berichten.created_at).toLocaleString("nl-NL", { dateStyle: "full", timeStyle: "short" }) }}</span>
		</h1>

		<div class="md:flex gap-x-4 mt-4 hidden">
			<NuxtLink :to="`mailto:${berichten.email}`" class="flex gap-3 items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:mail-send-line" size="1.4em" />Stuur een mail</NuxtLink>
			<NuxtLink v-if="berichten.phone" :to="`tel:${berichten.phone}`" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:phone-line" size="1.4em" /> </NuxtLink>
			<button @click="setScrollIndicatorToFull" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
				<icon :class="scrollWidth >= 90 ? ' rotate-180' : ''" class="text-white dark:text-black" name="ri:arrow-down-double-line" size="1.4em" />
			</button>
		</div>
	</div>
	<hr class="mt-6 mb-4 rounded-md dark:border-neutral-500 border-black md:max-w-[56vw]" />
	<div class="md:max-w-[56vw] relative">
		<Scroller :Width="scrollWidth" />
		<div class="whitespace-pre-wrap leading-[1.40em] text-neutral-900 dark:text-neutral-300 break-words h-fit max-h-[57vh] w-full overflow-scroll rounded-lg mt-2" @scroll="updateScrollIndicator" ref="scrollContainer">
			<span v-if="$colorMode.value == 'dark'">{{ berichten.message }}</span>
			<span v-else>{{ berichten.message }}</span>
		</div>
	</div>
	<hr class="mt-4 mb-4 rounded-md dark:border-neutral-500 border-black md:max-w-[60vw]" />
	<div class="md:flex justify-between items-center">
		<div class="flex md:hidden gap-x-4 mt-4">
			<NuxtLink :to="`mailto:${berichten.email}`" class="flex gap-3 items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:mail-send-line" size="1.4em" />Stuur een mail</NuxtLink>
			<NuxtLink v-if="berichten.phone" :to="`tel:${berichten.phone}`" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:phone-line" size="1.4em" /> </NuxtLink>
			<button @click="setScrollIndicatorToFull" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
				<icon :class="scrollWidth >= 90 ? ' rotate-180' : ''" class="text-white dark:text-black" name="ri:arrow-down-double-line" size="1.4em" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { berichten, Update } = defineProps<{ berichten: Record<string, any>; Update?: () => void }>();

	const scrollWidth = ref(0);
	const scrollContainer = ref(null);

	const canScroll = computed(() => {
		const container: any = scrollContainer.value;
		return container && container.scrollHeight > container.clientHeight;
	});

	onMounted(() => {
		if (!canScroll.value) {
			scrollWidth.value = 100;
			if (Update) Update();
		}
	});

	const setScrollIndicatorToFull = () => {
		if (scrollWidth.value >= 90) scrollToTop();
		else scrollToBottom();
	};

	const scrollToBottom = () => {
		const container: any = scrollContainer.value;
		container.scrollTo({
			top: container.scrollHeight,
			behavior: "smooth",
		});
	};

	const scrollToTop = () => {
		const container: any = scrollContainer.value;
		container.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const updateScrollIndicator = () => {
		const container: any = scrollContainer.value;
		const scrollHeight = container.scrollHeight - container.clientHeight;
		const scrollTop = container.scrollTop;
		scrollWidth.value = (scrollTop / scrollHeight) * 100;
	};

	if (Update) {
		watch(scrollWidth, async () => {
			if (scrollWidth.value >= 90) Update();
		});
	}

</script>
