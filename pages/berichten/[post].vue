<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full select-none md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
				<div class="grid gap-24">
					<div class="flex items-center justify-between md:mt-[0.15em]">
						<button aria-label="GaTerug" class="dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg" @click="$router.back()">
							<Icon class="text-white dark:text-black" name="ri:arrow-left-fill" size="1.2em" />
						</button>
						<div class="flex gap-4 items-center">
							<ColorMode />
							<Online />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-gray-50 dark:hover:ring-gray-50 dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</div>
					</div>
				</div>
				<div class="w-full h-fit mt-6 md:mt-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="md:flex justify-between items-center">
						<h1 class="text-[1.5em] leading-7 text-balance select-none text-black dark:text-white font-medium -mb-1">
							Contactverzoek van <span class="font-black">{{ berichten.name }}</span>
							<span class="block text-sm text-neutral-700 dark:text-neutral-300">{{ new Date(berichten.created_at).toLocaleString("nl-NL", { dateStyle: "full", timeStyle: "short" }) }}</span>
						</h1>
						<div class="md:flex gap-x-4 mt-4 hidden">
							<button @click="setScrollIndicatorToFull" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
								<icon class="text-white dark:text-black" name="ri:arrow-left-right-line" size="1.4em" />
							</button>
						</div>
					</div>
					<hr class="mt-6 mb-4 rounded-md dark:border-neutral-500 border-black md:max-w-[56vw]" />
					<div class="md:max-w-[56vw] relative">
						<div class="absolute -top-7 max-w-[100.5%] left-0 h-1 dark:bg-white rounded-md bg-black transition-all duration-200" :style="{ width: scrollWidth + '%' }"></div>
						<div class="whitespace-pre-wrap leading-[1.40em] break-words h-fit max-h-[57vh] w-full overflow-scroll rounded-lg mt-2 dark:text-neutral-300" @scroll="updateScrollIndicator" ref="scrollContainer">
							{{ berichten.message }}
						</div>
					</div>
					<hr class="mt-4 mb-4 rounded-md dark:border-neutral-500 border-black md:max-w-[60vw]" />
					<div class="md:flex justify-between items-center">
						<div class="flex md:hidden gap-x-4 mt-4">
							<button @click="setScrollIndicatorToFull" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
								<icon class="text-white dark:text-black" name="ri:arrow-left-right-line" size="1.4em" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	useSeoMeta({
		title: "PortFolio - Berichten",
		description: "Welkom op mijn portfolio website!",
		ogTitle: "PortFolio",
		ogDescription: "Welkom op mijn portfolio website!",
		ogImage: "/icons/test.png",
		ogUrl: "/",
		twitterTitle: "PortFolio",
		twitterDescription: "Welkom op mijn portfolio website!",
		twitterImage: "/icons/test.png",
		twitterCard: "summary",
	});

	useHead({
		htmlAttrs: { lang: "nl" },
		link: [{ rel: "icon", type: "image/png" }],
	});

	definePageMeta({
		middleware: ["user-auth"],
	});

	const { $pwa, $csrfFetch, $PusherOnStart } = useNuxtApp();
	const Installed = ref(false);

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
	});

	const berichten = ref({});
	const PostID = useRoute().params.post;
	const { data, error } = await useFetch(`/api/berichten/posts/${PostID}`);
	berichten.value = data.value.Response;

	if (error.value) {
		throw createError({
			statusCode: 404,
			message: error.value.data.message,
			statusMessage: "De aangevraagde pagina is niet gevonden!",
			fatal: true,
		});
	}

	const scrollWidth = ref(0);
	const scrollContainer = ref(null);

	const canScroll = computed(() => {
		const container = scrollContainer.value;
		return container && container.scrollHeight > container.clientHeight;
	});

	onMounted(() => {
		if (!canScroll.value) {
			scrollWidth.value = 100;
			UpdateReadStatus();
		}
	});

	const setScrollIndicatorToFull = () => {
		if (scrollWidth.value >= 90) { scrollWidth.value = 0; scrollToTop(); }
		else { scrollWidth.value = 100; scrollToBottom(); }
	};

	const scrollToBottom = () => {
		const container = scrollContainer.value;
		container.scrollTo({
			top: container.scrollHeight,
			behavior: "smooth",
		});
	};

	const scrollToTop = () => {
		const container = scrollContainer.value;
		container.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const updateScrollIndicator = () => {
		const container = scrollContainer.value;
		const scrollHeight = container.scrollHeight - container.clientHeight;
		const scrollTop = container.scrollTop;
		scrollWidth.value = (scrollTop / scrollHeight) * 100;
	};

	const store = useSessionsStore()
	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};
</script>
