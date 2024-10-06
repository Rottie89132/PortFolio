<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed select-none w-full h-full p-4 pb-5 md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'"
				class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto xl:overflow-hidden">
				<div class="grid gap-24">
					<div class="flex items-center justify-between">
						<NavigationLinksAdmin />
						<div class="flex gap-4 items-center">
							<ColorMode />
							<Online />
							<button @click="Logout"
								class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</div>
					</div>
				</div>
				<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="flex items-center justify-between gap-3 mb-3">
						<h1 class="text-[1.5em] dark:text-white text-black font-extrabold">Berichten</h1>
						<PaginationButtons :items="Items" :hidebuttons="hidebuttons" :loading="loading"
							v-model:currentPage="currentPage" :PreviousPage="PreviousPage" :NextPage="NextPage"
							:navigateToPage="navigateToPage">
						</PaginationButtons>
					</div>
					<div v-if="Items.length < 1">
						<p class="opacity-75 mb-6 dark:text-white text-sm">Helaas je hebt nog geen berichten ontvangen.
							Kom later terug om te kijken of je berichten hebt ontvangen.</p>
					</div>
					<div v-else :class="Items.length < 5 ? ' h-fit' : ' md:h-[64vh]'"
						class="p-3 bg-[#F7F7F7] dark:bg-[#111111] xl:h-fit rounded-2xl transition-transform">
						<div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
							<div v-for="(item, index) in Items" :key="index" class="mb-3 delay-100 last:mb-0 animate-fade-in">
								<CardMessages :item :DeleteMail="DeleteMail" :isAdmin="true" />
							</div>
							<!-- <CardMessages :Items :DeleteMail="DeleteMail" :isAdmin="true" /> -->
							<!-- <div v-for="(item, index) in Items" :key="index"
								class="mb-3 delay-100 last:mb-0 animate-fade-in">
								<div v-if="item.loaded"
									class="p-3 xl:p-2.5 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
									<div class="flex items-center justify-between gap-2">
										<h2 class="text-xs dark:text-white font-bold truncate md:text-base">{{
											item.email }}</h2>
										<p class="text-[0.65em] dark:text-white md:text-sm opacity-70">{{
											useTimeAgo(item.created_at).value }}</p>
									</div>
									<p
										class="dark:text-white text-balance mt-1 md:mt-0 mr-11 md:mr-32 xl:mr-32 text-xs line-clamp-2 opacity-80">
										{{ item.message }}
									</p>
									<div class="flex mt-2.5 md:mt-2 items-center gap-3">
										<NuxtLink :to="`/dashboard/berichten/${item._id}`"
											class="px-4 py-1 text-xs font-semibold text-white dark:text-black dark:bg-white dark:ring-white bg-black rounded-md ring-2 ring-black">
											Bekijken</NuxtLink>
										<MessagesMarked :PostRead="item.read" />
										<button @click="DeleteMail(item)"
											class="px-[0.45em] rounded-md py-1 text-xs flex justify-center items-center font-semibold dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200">
											<Icon name="material-symbols:delete-outline" size="1.3em"></Icon>
										</button>
									</div>
								</div>
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<ModalConfirmation v-model:texthead="title" v-model:textbase="subtitle" v-model:status="OpenModule"
			v-model:DelayStatus="OpenModuleDelay">
			<div v-if="!loadingMail" class="flex mb-2 items-center gap-4">
				<button @click="DeleteMailConfirm"
					class="flex font-semibold items-center gap-2 px-8 py-2 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">Verwijderen</button>
				<button @click="closeModal"
					class="flex font-semibold items-center gap-2 px-6 py-2 text-sm bg-gray-100 ring-2 ring-gray-100 text-neutral-800 rounded-md">Annuleren</button>
			</div>
			<div v-else-if="loadingMail" class="flex mb-2 items-center gap-4">
				<button disabled
					class="flex font-semibold items-center gap-2 px-6 py-2 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
					<Icon class="animate-spin" name="ri:refresh-line" size="1.25em" />Verwerken
				</button>
			</div>
		</ModalConfirmation>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: ["authorized"],
	});

	useSeoMeta({
		title: "Admin - Berichten",
		description: "Welkom op mijn portfolio website!",
		ogTitle: "Portfolio",
		ogDescription: "Welkom op mijn portfolio website!",
		ogImage: "/icons/test.png",
		ogUrl: "/",
		twitterTitle: "Portfolio",
		twitterDescription: "Welkom op mijn portfolio website!",
		twitterImage: "/icons/test.png",
		twitterCard: "summary",
	});

	useHead({
		htmlAttrs: { lang: "nl" },
		link: [{ rel: "icon", type: "image/png" }],
	});

	const { $pwa, $PusherOnStart, $PusherOnEvent, $csrfFetch } = useNuxtApp();
	const Installed = ref(false);
	const Items = ref([]);
	const currentPage = ref();
	const hidebuttons = ref([]);
	const loading = ref(false);
	const router = useRouter();
	const berichten = ref([]);
	const ReactiveEvent = ref();

	const title = ref();
	const subtitle = ref();
	const OpenModule = ref(false);
	const OpenModuleDelay = ref(false);
	const loadingMail = ref(false);
	const itemData = ref();

	currentPage.value = useRoute().query.Page;
	const { data: Berichten } = await useFetch(`/api/berichten/${currentPage.value}`);

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
		$PusherOnEvent("client-eventNotification", ReactiveEvent);
	});

	const store = useSessionsStore()

	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	const closeModal = () => {
		OpenModuleDelay.value = false;
		setTimeout(() => {
			OpenModule.value = false;
		}, 100);
	};

	const navigateToPage = async () => {
		if (currentPage.value > hidebuttons.value.total) currentPage.value = hidebuttons.value.total;
		else if (currentPage.value < 1) currentPage.value = 1;
		useLocalStorage("BerichtenPage").value = currentPage.value;

		router.push({ path: "/dashboard/berichten", query: { Page: currentPage.value } });
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const PreviousPage = async () => {
		const page = useLocalStorage("BerichtenPage");

		if (page.value == 1) page.value = hidebuttons.value.total;
		else page.value = Number(page.value) - 1;

		router.push({ path: "/dashboard/berichten", query: { Page: page.value } });
		currentPage.value = page.value;
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const NextPage = async () => {
		const page = useLocalStorage("BerichtenPage");

		if (page.value >= hidebuttons.value.total) page.value = 1;
		else page.value = Number(page.value) + 1;

		router.push({ path: "/dashboard/berichten", query: { Page: page.value } });
		currentPage.value = page.value;
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		loadedBerichten(Berichten);
	};

	const animateIn = () => {
		loading.value = true;
		setTimeout(() => {
			Items.value.forEach((item, index) => {
				setTimeout(() => {
					item.loaded = true;
				}, index * 200);
			});
		}, 250);

		setTimeout(() => {
			loading.value = false;
		}, 500);
	};

	const DeleteMail = async (item) => {
		itemData.value = item;
		title.value = item.email;
		subtitle.value = "Weet je zeker dat je dit bericht wilt verwijderen?";

		OpenModule.value = true;
		setTimeout(() => {
			OpenModuleDelay.value = true;
		}, 100);
	};

	const DeleteMailConfirm = async () => {
		loadingMail.value = true;
		await useCsrfFetch(`/api/berichten/posts/${itemData.value._id}`, { method: "DELETE" });
		const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);

		setTimeout(() => {
			closeModal();
			loadedBerichten(Berichten);
			loadingMail.value = false;
		}, 500);
	};

	const loadedBerichten = async (Repositories) => {
		Items.value = [];
		berichten.value = Repositories.value?.Response;
		hidebuttons.value = Repositories.value;

		if (berichten.value) {
			currentPage.value = Repositories.value.page;
			useLocalStorage("BerichtenPage").value = Repositories.value.page;

			berichten.value.forEach((item) => {
				Items.value.push({ ...item, loaded: false });
			});
		} else if (currentPage.value != 1) {
			currentPage.value = 1;
			useLocalStorage("BerichtenPage").value = 1;
			const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/${currentPage.value}`);
			router.push({ path: "/dashboard/berichten", query: { Page: currentPage.value } });

			berichten.value = Berichten.value?.Response;
			hidebuttons.value = Berichten.value;

			if (berichten.value) {
				currentPage.value = Berichten.value.page;
				useLocalStorage("BerichtenPage").value = Berichten.value.page;
				berichten.value.forEach((item) => {
					Items.value.push({ ...item, loaded: false });
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

<style scoped>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fadeIn 0.5s ease-out;
	}
</style>
