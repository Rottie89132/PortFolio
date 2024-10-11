<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed select-none w-full h-full p-4 pb-5 md:pb-0 md:p-0">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto md:overflow-hidden xl:overflow-hidden">
				<div class="grid gap-24">
					<div class="flex items-center justify-between">
						<NavigationLinksAdmin />
						<div class="flex gap-4 items-center">
							<ColorMode />
							<Online />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</div>
					</div>
				</div>
				<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<h1 class="text-[1.5em] text-black dark:text-white font-extrabold mb-3">Analytics</h1>
					<div class="xl:grid grid-cols-2 gap-4">
						<div class="mb-3 bg-[#F7F7F7] flex flex-col justify-center dark:bg-[#111111] rounded-lg p-3 py-5">
							<p class="font-black mb-1 dark:text-white">Bezoekers</p>
							<p class="leading-[1.1em] dark:text-gray-300 text-gray-600 text-sm">
								Er {{ MonthlyVisted > 1 ? "zijn" : "is" }} <span class="font-black text-black dark:text-white">{{ MonthlyVisted }}</span> bezoeker{{ MonthlyVisted > 1 ? "s" : "" }} geweest deze maand
							</p>
						</div>
						<div class="p-3 hidden xl:block bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl mb-3">
							<div class="flex items-center justify-between">
								<p class="font-black dark:text-white">Projecten</p>
								<NuxtLink :to="`/dashboard/Repos?Page=${currentPage}`" class="px-5 py-1 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600"> Toevoegen</NuxtLink>
							</div>
						</div>
					</div>
					<div class="mb-3 bg-[#F7F7F7] md:max-h-64 flex flex-col justify-center dark:bg-[#111111] rounded-lg p-3 py-5">
						<ChartVisits :Analytics />
					</div>
					<div class="p-3 xl:hidden bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl mb-3">
						<div class="flex items-center justify-between">
							<p class="font-black dark:text-white">Projecten</p>
							<NuxtLink :to="`/dashboard/Repos?Page=${currentPage}`" class="px-5 py-1 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600"> Toevoegen</NuxtLink>
						</div>
					</div>
					<div class="p-3 bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl mb-3">
						<div class="flex mb-3 items-center justify-between">
							<p class="font-black dark:text-white">Berichten</p>
							<NuxtLink :to="`/dashboard/Berichten?Page=${currentPageBerichten}`" class="text-xs font-medium dark:text-indigo-500 text-indigo-600"> Bekijken alle berichten </NuxtLink>
						</div>
						<div class="mb-3 mt-1" v-if="Messages.length < 1">
							<p class="opacity-75 dark:text-white text-sm">Je hebt nog geen berichten ontvangen</p>
						</div>
						<div v-else class="h-fit bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl">
							<div class="w-full h-full overflow-y-auto rounded-xl snap-y snap-proximity scroll-smooth">
								<div v-for="(item, index) in Messages" class="w-full p-3 mb-3 bg-white dark:bg-neutral-900 last:mb-0 rounded-xl md:snap-end snap-center h-fit" @click="navigateTo(`/dashboard/berichten/${item._id}`)">
									<div class="flex items-center justify-between gap-2">
										<h2 class="text-xs dark:text-white font-bold truncate md:text-sm">{{ item.email }}</h2>
										<p class="text-[0.65em] dark:text-white md:text-sm opacity-70">{{ useTimeAgo(item.created_at).value }}</p>
									</div>
									<p class="mt-2 md:mt-0 xl:mt-1 dark:text-white mr-11 xl:mr-32 text-xs line-clamp-2 opacity-80">
										{{ item.message }}
									</p>
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
	useSeoMeta({
		title: "Admin - Home",
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

	definePageMeta({
		middleware: ["authorized"],
	});

	const { $pwa, $PusherOnStart, $PusherOnEvent, $csrfFetch } = useNuxtApp();
	const MonthlyVisted = ref(0);
	const currentPage = useLocalStorage("AdminRepoPage", 1);
	const currentPageBerichten = useLocalStorage("BerichtenPage", 1);

	const Messages = ref([]);
	const Installed = ref(false);
	const ReactiveEvent = ref();
	const ReactiveVisitEvent = ref();
	const Analytics = ref();

	const { data: AnalyticsData } = await useFetch("/api/analytics");
	const { data: messages } = await useFetch("/api/berichten");

	Messages.value = messages.value.Response;
	Analytics.value = AnalyticsData.value;
	MonthlyVisted.value = Analytics.value.result[Analytics.value.result.length - 1].MonthlyVisted || 0;

	const store = useSessionsStore()
	
	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
		$PusherOnEvent("client-eventNotification", ReactiveEvent);
		$PusherOnEvent("client-eventVisitNotification", ReactiveVisitEvent);
	});

	watch(ReactiveEvent, async () => {
		const { data: messages } = await useFetch("/api/berichten");
		Messages.value = messages.value.Response;
	});

	watch(ReactiveVisitEvent, async () => {
		const { data: AnalyticsData } = await useFetch("/api/analytics");
		Analytics.value = AnalyticsData.value;
		MonthlyVisted.value = Analytics.value.result[Analytics.value.result.length - 1].MonthlyVisted || 0;
	});
</script>
