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
					<CardDetails :berichten :Update="UpdateReadStatus" />
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
			message: "The requested post could not be found",
			fatal: true,
		});
	}

	const UpdateReadStatus = async () => {
		if (!berichten.value.read) {
			berichten.value.read = true;
			await $csrfFetch(`/api/berichten/posts/${PostID}`, { method: "PATCH" });
		}
	};

	const store = useSessionsStore();
	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};
</script>
