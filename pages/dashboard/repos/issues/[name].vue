<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed select-none w-full h-full p-4 pb-5 md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto xl:overflow-hidden md:overflow-hidden">
				<div class="grid gap-24">
					<div class="flex items-center justify-between">
						<NuxtLink to="/dashboard/repos" aria-label="GaTerug" class="dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg">
							<Icon class="text-white dark:text-black" name="ri:arrow-left-fill" size="1.2em" />
						</NuxtLink>
						<div class="flex gap-4 items-center">
							<ColorMode />
							<Online />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</div>
					</div>
				</div>
				<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="flex items-center justify-between gap-3 mb-3">
						<h1 class="text-[1.5em] dark:text-white text-black font-extrabold">Issues</h1>
						<PaginationButtons :items="items" :hidebuttons="hidebuttons" :loading="loading" v-model:currentPage="currentPage" :PreviousPage="PreviousPage" :NextPage="NextPage" :navigateToPage="navigateToPage"> </PaginationButtons>
					</div>

					<div class="flex items-center gap-2 dark:text-white" v-if="loadingIndicater || loading">
						<icon name="mingcute:loading-fill" class="animate-spin" size="1.4em"></icon>
						Issues worden ingeladen
					</div>

					<div v-else-if="!Issues && items.length < 1">
						<p class="opacity-75 mb-6 dark:text-white text-sm">
                            Momenteel heeft deze repository geen issues. Kom later nog eens terug.
                        </p>
					</div>
					<div v-else-if="Issues && Issues.length < 1" class="mb-[5.2em] -mt-2">
						<p class="opacity-75 mb-6 dark:text-white text-sm">
                            Geen repositories gevonden die overeenkomen met uw zoekopdracht, voor dit account of deze organisatie.
                        </p>
						<a href="https://github.com/apps/rottie-portfolio/installations/new" target="_blank" class="px-4 py-2 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600"> Maak verbinding </a>
					</div>

					<div v-else class="p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform">
						<div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
							<div v-for="(item, index) in items" :key="index" class="last:mb-0 mb-3">
								<div class="delay-100 last:mb-0 animate-fade-in">
									<a v-if="item.loaded" :href="item.html_url" target="_blank">
										<div class="p-3 xl:p-2.5 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
											<div class="flex flex-wrap justify-between items-center gap-2 mb-3">
												<div class="flex items-center flex-wrap gap-2">
													<div v-for="label in item.labels">
														<div class="p-1 px-2 rounded-lg text-xs opacity-95 bg-black dark:bg-white text-white dark:text-black">
															<p class="font-medium">{{ label.name }}</p>
														</div>
													</div>
												</div>
												<div class="p-1 px-2 font-medium rounded-lg text-xs dark:text-neutral-300 dark:bg-neutral-800 text-neutral-600 bg-neutral-200">#{{ item.number }}</div>
											</div>
											<hr class="my-2 dark:border-neutral-600 border-neutral-300" />
											<h2 class="text-sm dark:text-white font-medium line-clamp-2 md:text-base">
												{{ item.title }}
											</h2>

											<div class="mt-2 text-sm flex items-center gap-2 dark:opacity-80">
												<div class="text-xs flex items-center gap-1 dark:text-white truncate md:text-base">
													<icon name="ri:git-repository-fill" size="1.2em"></icon>
													{{ item.user.login }}
												</div>

												<div class="text-xs flex items-center gap-1 dark:text-white truncate md:text-base">
													<icon name="ri:time-fill" size="1.2em"></icon>
													{{ useTimeAgo(item.created_at).value }}
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
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
		link: [
			{ rel: "icon", type: "image/png" },
			{ rel: "preload", as: "image", href: "/Trash.svg" },
		],
	});

	const { $pwa, $csrfFetch } = useNuxtApp();
	const loadingIndicater = ref(false);
	const name = useRoute().params.name;
	const Installed = ref(false);
	const currentPage = ref(1);
	const items = ref([]);
	const Issues = ref([]);
	const hidebuttons = ref({});
	const loading = ref(true);
	const router = useRouter();

	currentPage.value = useRoute().query.Page ? Number(useRoute().query.Page) : 1;
	const store = useSessionsStore();

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
	});

	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	const navigateToPage = async () => {
		loadingIndicater.value = true;

		if (currentPage.value > hidebuttons.value.total) currentPage.value = hidebuttons.value.total;
		else if (currentPage.value < 1) currentPage.value = 1;

		useLocalStorage("AdminIssuesPage").value = currentPage.value;
		router.push({ path: `/dashboard/repos/issues/${name}`, query: { Page: currentPage.value } });

		const { data } = await useFetch(`/api/repo/auth/issues/${name}?page=${currentPage.value}`);
		loadedRepos(data);
	};

	const PreviousPage = async () => {
		loadingIndicater.value = true;
		const page = useLocalStorage("AdminIssuesPage");

		if (page.value == 1) page.value = hidebuttons.value.total;
		else page.value = Number(page.value) - 1;

		router.push({ path: `/dashboard/repos/issues/${name}`, query: { Page: page.value } });
		currentPage.value = page.value;

		const { data } = await useFetch(`/api/repo/auth/issues/${name}?page=${page.value}`);
		loadedRepos(data);
	};

	const NextPage = async () => {
		loadingIndicater.value = true;
		const page = useLocalStorage("AdminIssuesPage");

		if (page.value >= hidebuttons.value.total) page.value = 1;
		else page.value = Number(page.value) + 1;

		router.push({ path: `/dashboard/repos/issues/${name}`, query: { Page: page.value } });
		currentPage.value = page.value;

		const { data } = await useFetch(`/api/repo/auth/issues/${name}?page=${page.value}`);
		loadedRepos(data);
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

	const loadedRepos = async (data) => {
		if (data.value?.statusCode == 200) {
			items.value = [];
			Issues.value = data.value.issues;
			hidebuttons.value = data.value;

			if (Issues.value) {
				currentPage.value = data.value.page;
				useLocalStorage("AdminIssuesPage").value = data.value.page;
				Issues.value.forEach((item, index) => {
					items.value.push({ ...item, loaded: false });
				});
			} else if (currentPage.value != 1) {
				currentPage.value = 1;
				useLocalStorage("AdminIssuesPage").value = 1;

				const { data } = await useFetch(`/api/repo/auth/issues/${name}?page=${currentPage.value}`);
				router.push({ path: `/dashboard/repos/issues/${name}`, query: { Page: currentPage.value } });

				Issues.value = data.value.issues;
				hidebuttons.value = data.value;

				if (Issues.value) {
					currentPage.value = data.value.page;
					useLocalStorage("AdminIssuesPage").value = data.value.page;
					Issues.value.forEach((item, index) => {
						items.value.push({ ...item, loaded: false });
					});
				}
			}
			animateIn();
		}
	};

	if (document) {
		setTimeout(async () => {
			const { data, error } = await useFetch(`/api/repo/auth/issues/${name}`);
			if (!error.value) loadedRepos(data);
			else loading.value = false;
		}, 100);
	}
</script>
