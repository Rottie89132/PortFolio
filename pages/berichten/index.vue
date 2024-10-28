<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full select-none md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
				<div class="grid gap-24">
					<div class="flex items-center justify-between md:mt-[0.15em]">
						<NavigationLinksUser />
						<div class="flex gap-4 items-center">
							<ColorMode />
							<Online />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-gray-50 dark:hover:ring-gray-50 dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</div>
					</div>
				</div>
				<div class="w-full h-fit mt-6 md:mt-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="flex items-center justify-between gap-3 mb-3">
						<h1 class="text-[1.5em] dark:text-white text-black font-extrabold">Berichten</h1>
						<PaginationButtons :items :hidebuttons :loading v-model:currentPage="currentPage" :PreviousPage :NextPage :navigateToPage></PaginationButtons>
					</div>
					<div v-if="items.length < 1">
						<p class="opacity-75 dark:text-white">Je hebt nog geen berichten verstuurd, wanneer je een bericht verstuurd zal je het hier terug vinden.</p>
					</div>
					<div v-else :class="items.length < 5 ? ' h-fit' : ' md:h-[64vh]'" class="p-3 bg-[#F7F7F7] dark:bg-[#111111] xl:h-fit rounded-2xl transition-transform">
						<div class="w-full h-full snap-y snap-proximity rounded-xl scroll-smooth">
							<div v-for="(item, index) in items" :key="index" class="mb-3 delay-100 last:mb-0 animate-fade-in">
								<CardMessages :isAdmin="false" :item />
							</div>
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

	const { $pwa, $PusherOnStart, $PusherOnEvent, $csrfFetch } = useNuxtApp();
	const Installed = ref(false);
	const items = ref([]);
	const currentPage = ref();
	const hidebuttons = ref([]);
	const loading = ref(false);
	const router = useRouter();
	const berichten = ref([]);
	const ReactiveEvent = ref();

	currentPage.value = useRoute().query.Page ? Number(useRoute().query.Page) : 1;
	const { data: Berichten } = await useFetch(`/api/berichten/${currentPage.value}`);

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
		$PusherOnEvent("client-eventNotification", ReactiveEvent);
	});

	const store = useSessionsStore();

	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	const navigateToPage = async () => {
		if (currentPage.value > hidebuttons.value.total) currentPage.value = hidebuttons.value.total;
		else if (currentPage.value < 1) currentPage.value = 1;
		useLocalStorage("BerichtenPage").value = currentPage.value;

		router.push({ path: "/berichten", query: { Page: currentPage.value } });
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const PreviousPage = async () => {
		const page = useLocalStorage("BerichtenPage");

		if (page.value == 1) page.value = hidebuttons.value.total;
		else page.value = Number(page.value) - 1;

		router.push({ path: "/berichten", query: { Page: page.value } });
		currentPage.value = page.value;
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const NextPage = async () => {
		const page = useLocalStorage("BerichtenPage");

		if (page.value >= hidebuttons.value.total) page.value = 1;
		else page.value = Number(page.value) + 1;

		router.push({ path: "/berichten", query: { Page: page.value } });
		currentPage.value = page.value;
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const animateIn = () => {
		loading.value = true;
		setTimeout(() => {
			items.value.forEach((item, index) => {
				setTimeout(() => {
					item.loaded = true;
				}, index * 200);
			});
		}, 250);

		setTimeout(() => {
			loading.value = false;
		}, 500);
	};

	const loadedBerichten = async (Repositories) => {
		items.value = [];
		berichten.value = Repositories.value?.Response;
		hidebuttons.value = Repositories.value;

		if (berichten.value) {
			currentPage.value = Repositories.value.page;
			useLocalStorage("BerichtenPage").value = Repositories.value.page;

			berichten.value.forEach((item) => {
				items.value.push({ ...item, loaded: false });
			});
		} else if (currentPage.value != 1) {
			currentPage.value = 1;
			useLocalStorage("BerichtenPage").value = 1;
			const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);
			router.push({ path: "/berichten", query: { Page: currentPage.value } });

			berichten.value = Berichten.value?.Response;
			hidebuttons.value = Berichten.value;

			if (berichten.value) {
				currentPage.value = Berichten.value.page;
				useLocalStorage("BerichtenPage").value = Berichten.value.page;
				berichten.value.forEach((item) => {
					items.value.push({ ...item, loaded: false });
				});
			}
		}

		animateIn();
	};

	loadedBerichten(Berichten);

	watch(ReactiveEvent, async () => {
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${useRoute().query.Page}`);
		loadedBerichten(Berichten);
	});
</script>
