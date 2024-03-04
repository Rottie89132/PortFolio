<template>
	<VitePwaManifest />
	<Landscape />
	<div class="fixed select-none w-full h-full p-4 pb-5 md:pb-0 md:p-0">
		<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto xl:overflow-hidden md:overflow-hidden">
			<div class="grid gap-24">
				<div class="flex items-center justify-between">
					<NavLinksAdmin />
					<div class="flex gap-4 items-center">
						<ClientOnly>
							<ColorMode />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</ClientOnly>
					</div>
				</div>
			</div>
			<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]">
				<div class="flex items-center justify-between gap-3 mb-3">
					<h1 class="text-[1.5em] dark:text-white text-black font-extrabold">Repositories</h1>
					<div v-if="items.length > 0 && hidebuttons.total > 1" class="flex items-center gap-2">
						<button v-if="hidebuttons.page > 1" :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="PreviousPage">
							<Icon name="material-symbols:keyboard-arrow-left" size="1.2em"></Icon>
						</button>
						<button v-else :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="NextPage">
							<Icon name="material-symbols:keyboard-arrow-right" size="1.2em"></Icon>
						</button>
						<button v-if="hidebuttons.page > 1" :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="NextPage">
							<Icon :name="hidebuttons.page >= hidebuttons.total ? 'material-symbols:keyboard-double-arrow-left' : 'material-symbols:keyboard-arrow-right'" size="1.2em"></Icon>
						</button>
						<button v-else :disabled="loading" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl" @click="PreviousPage">
							<Icon :name="hidebuttons.page <= 1 ? 'material-symbols:keyboard-double-arrow-right' : 'material-symbols:keyboard-arrow-left'" size="1.2em"></Icon>
						</button>

						<form @submit.prevent="navigateToPage">
							<input v-model="currentPage" type="number" class="p-[0.34rem] ring-2 ring-[#e8e8e8] dark:ring-[#1a1a1a] dark:bg-[#111111] dark:text-white appearance-none w-9 text-center font-medium bg-[#F7F7F7] flex items-center justify-center rounded-xl" />
						</form>
					</div>
				</div>
				<div class="flex items-center gap-2 dark:text-white" v-if="loadingIndicater || loading"><icon name="mingcute:loading-fill" class="animate-spin" size="1.4em"></icon>Repositories worden ingeladen</div>
				<div v-else-if="Repositories && Repositories.length < 1" class="mb-[5.2em] -mt-2">
					<p class="opacity-75 mb-6 dark:text-white text-sm">Voordat u verder gaat, moet u eerst een verbinding maken met uw GitHub-account.</p>
					<a href="https://github.com/apps/rottie-portfolio/installations/new" target="_blank" class="px-4 py-2 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600"> Maak verbinding </a>
				</div>

				<div v-else class="p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform">
					<div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
						<div v-for="(item, index) in items" :key="index" class="mb-3 delay-100 last:mb-0 animate-fade-in">
							<div v-if="item.loaded" class="p-3 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
								<div class="flex items-center gap-2">
									<NuxtImg draggable="false" :src="item.owner.avatar_url" class="w-5 rounded-full"> </NuxtImg>
									<h3 class="font-semibold dark:text-white">{{ item.full_name }}</h3>
								</div>
								<p class="mt-3 md:mt-1 whitespace-pre-wrap text-balance dark:text-white mr-5 text-sm break-words opacity-70 line-clamp-2">
									{{ item.description || defaultDescription }}
								</p>
								<div class="flex items-center gap-3 font-semibold">
									<button v-if="item.saved" @click="DeleteRepo(item)" class="flex items-center justify-center font-semibold px-3 py-1 mt-3 mb-1 text-xs dark:text-black dark:bg-white dark:ring-white text-white bg-black rounded ring-2 ring-black">Verwijderen</button>
									<button v-else @click="SaveRepo(item)" class="flex items-center justify-center px-3 py-1 mt-3 mb-1 font-semibold text-xs dark:text-black dark:bg-white dark:ring-white text-white bg-black rounded ring-2 ring-black">Toevoegen</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ModalConfirmation v-model:texthead="title" v-model:textbase="subtitle" v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay">
		<div v-if="!loadingRepos" class="flex mb-2 items-center gap-4">
			<button @click="DeleteRepoConfirm" class="flex font-semibold items-center gap-2 px-8 py-2 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">Verwijderen</button>
			<button @click="closeModal" class="flex font-semibold items-center gap-2 px-6 py-2 text-sm bg-gray-100 ring-2 ring-gray-100 text-neutral-800 rounded-md">Annuleren</button>
		</div>
		<div v-else-if="loadingRepos" class="flex mb-2 items-center gap-4">
			<button disabled class="flex font-semibold items-center gap-2 px-6 py-2 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class="animate-spin" name="ri:refresh-line" size="1.25em" />Verwerken</button>
		</div>
	</ModalConfirmation>
</template>

<script setup>
	definePageMeta({
		middleware: ["authorized"],
	});

	useSeoMeta({
		title: "Admin - Repositories",
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

	useLocalStorage("AdminRepoPage", 1);
	const { $pwa, $PusherOnStart, $csrfFetch } = useNuxtApp();
	const currentPage = ref();
	const hidebuttons = ref([]);
	const loading = ref(true);
	const loadingIndicater = ref(false);
	const loadingRepos = ref(false);
	const router = useRouter();
	const items = ref([]);
	const Installed = ref(false);
	const ItemData = ref([]);
	const Saved = ref(false);
	const SavedRepo = ref();

	const Repositories = ref([]);
	const SavedRepositories = ref([]);
	const title = ref();
	const subtitle = ref();
	const OpenModule = ref(false);
	const OpenModuleDelay = ref(false);

	currentPage.value = useRoute().query.Page;
	const defaultDescription = "Op dit moment is er helaas geen specifieke beschrijving beschikbaar voor dit project.";

	const Logout = async () => {
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
	});

	const navigateToPage = async () => {
		loadingIndicater.value = true;

		if (currentPage.value > hidebuttons.value.total) currentPage.value = hidebuttons.value.total;
		else if (currentPage.value < 1) currentPage.value = 1;

		useLocalStorage("AdminRepoPage").value = currentPage.value;
		router.push({ path: "/dashboard/Repos", query: { Page: currentPage.value } });

		const { data: Repositories } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
		const { data: SavedRepo } = await useFetch(`/api/repo`);
		loadedRepos(Repositories, SavedRepo);
	};

	const PreviousPage = async () => {
		loadingIndicater.value = true;
		const page = useLocalStorage("AdminRepoPage");

		if (page.value == 1) page.value = hidebuttons.value.total;
		else page.value = Number(page.value) - 1;

		router.push({ path: "/dashboard/Repos", query: { Page: page.value } });
		currentPage.value = page.value;

		const { data: Repositories } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
		const { data: SavedRepo } = await useFetch(`/api/repo`);
		loadedRepos(Repositories, SavedRepo);
	};

	const NextPage = async () => {
		loadingIndicater.value = true;
		const page = useLocalStorage("AdminRepoPage");

		if (page.value >= hidebuttons.value.total) page.value = 1;
		else page.value = Number(page.value) + 1;

		router.push({ path: "/dashboard/Repos", query: { Page: page.value } });
		currentPage.value = page.value;

		const { data: Repositories } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
		const { data: SavedRepo } = await useFetch(`/api/repo`);
		loadedRepos(Repositories, SavedRepo);
	};

	const animateIn = () => {
		loadingIndicater.value = false;
		loading.value = true;
		setTimeout(() => {
			items.value.forEach((item, index) => {
				setTimeout(() => {
					item.loaded = true;
				}, index * 200);
			});
		}, 450);

		setTimeout(() => {
			loading.value = false;
		}, 500);
	};

	const loadedRepos = async (data, saved) => {
		if (data.value?.statusCode == 200) {
			items.value = [];
			Repositories.value = data.value.repositories;
			hidebuttons.value = data.value;

			if (SavedRepo.value.statusCode == 200) {
				SavedRepositories.value = saved.value.Response;
			}

			if (Repositories.value) {
				currentPage.value = data.value.page;
				useLocalStorage("AdminRepoPage").value = data.value.page;
				Repositories.value.forEach((item, index) => {
					const saved = SavedRepositories.value.find((repo) => repo.repo_id == item.id);
					items.value.push({ ...item, saved: saved ? true : false, loaded: false });
				});
			} else if (currentPage.value != 1) {
				currentPage.value = 1;
				useLocalStorage("AdminRepoPage").value = 1;
				const { data } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
				router.push({ path: "/dashboard/Repos", query: { Page: currentPage.value } });

				Repositories.value = data.value.repositories;
				hidebuttons.value = data.value;

				if (Repositories.value) {
					currentPage.value = data.value.page;
					useLocalStorage("AdminRepoPage").value = data.value.page;
					Repositories.value.forEach((item, index) => {
						const saved = SavedRepositories.value.find((repo) => repo.repo_id == item.id);
						items.value.push({ ...item, saved: saved ? true : false, loaded: false });
					});
				}
			}
			animateIn();
		}
	};

	const SaveRepo = async (item) => {
		await useCsrfFetch(`/api/repo/`, { method: "POST", body: { data: item } });

		const { data: Repositories } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
		const { data: SavedRepo } = await useFetch(`/api/repo`);
		loadedRepos(Repositories, SavedRepo);
	};

	const DeleteRepo = async (item) => {
		Saved.value = false;
		ItemData.value = item;
		title.value = item.full_name;
		subtitle.value = "Weet je zeker dat je deze repository wilt verwijderen van je portfolio?";

		OpenModule.value = true;
		setTimeout(() => {
			OpenModuleDelay.value = true;
		}, 100);
	};

	const DeleteRepoConfirm = async () => {
		loadingRepos.value = true;
		await useCsrfFetch(`/api/repo/`, { method: "DELETE", body: { data: ItemData.value.id } });

		const { data: Repositories } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
		const { data: SavedRepo } = await useFetch(`/api/repo`);

		setTimeout(() => {
			closeModal();
			loadedRepos(Repositories, SavedRepo);
			loadingRepos.value = false;
		}, 500);
	};

	const closeModal = () => {
		OpenModuleDelay.value = false;
		setTimeout(() => {
			OpenModule.value = false;
		}, 100);
	};

	if (process.client) {
		setTimeout(async () => {
			const { data, error } = await useFetch(`/api/repo/auth?page=${currentPage.value}`);
			const { data: SaveRepo } = await useFetch(`/api/repo`);

			if (!error.value) {
				SavedRepositories.value = SaveRepo.value.Response;
				SavedRepo.value = SaveRepo.value;
				loadedRepos(data, SaveRepo);
			} else {
				loading.value = false;
			}
		}, 100);
	}
</script>
