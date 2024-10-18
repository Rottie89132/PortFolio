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
				<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="bg-[#F7F7F7] dark:bg-[#111111] dark:text-white md:bg-[#F7F7F7] md:dark:bg-[#111111] p-4 rounded-xl">
						<div class="flex -mb-1 items-center gap-2">
							<p class="font-black">{{ Berichten.Response.name }}</p>
							<p class="select-text underline font-medium opacity-85 text-xs -mb-1">{{ Berichten.Response.phone }}</p>
						</div>
						<p class="font-medium opacity-75">{{ Berichten.Response.email }}</p>
						<div class="grid grid-cols-[1fr,1fr,0.1fr] mt-1 mb-4 md:flex items-center gap-3">
							<button class="dark:bg-white bg-neutral-800 hover:bg-neutral-900 hover:ring-neutral-900 dark:hover:bg-gray-50 dark:hover:ring-gray-50 ring-2 dark:ring-white ring-neutral-800 text-white dark:text-neutral-900 text-sm md:text-base font-bold p-1 md:px-8 rounded-md mt-2" @click="OpenMail(true)">Beantwoorden</button>
							<button class="dark:text-neutral-300 text-sm md:text-base dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-gray-200 ring-2 ring-gray-200 font-bold p-1 md:px-8 rounded-md mt-2" @click="OpenMail(false)">Afwijzen</button>
							<div class="dark:text-neutral-300 text-sm md:text-base justify-center dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-gray-200 ring-2 ring-gray-200 font-bold p-1 md:p-[0.40em] md:px-[0.40em] rounded mt-2 flex items-center" @click="markMessage">
								<Icon :class="MarkedPostId ? ' dark:text-white text-black' : 'text-neutral-600 dark:text-neutral-300'" class=" " :name="MarkedPostId ? 'material-symbols:bookmark-added' : 'material-symbols:bookmark-add'" size="1.2em" />
							</div>
						</div>
						<div class="whitespace-pre-wrap scroll-smooth leading-[1.30em] break-words text-balance max-h-[64vh] w-full bg-white dark:bg-neutral-900 p-4 rounded-lg mt-2 dark:text-white">
							<div class="max-h-[59.7vh] scroll-smooth overflow-auto">
								<span id="ToTop" class="md:hidden -ml-1"></span>
								{{ Berichten.Response.message }}
								<div v-if="Berichten.Response.message.length > 600" class="md:hidden p-2 -mt-2 flex items-center justify-end" id="ToBottem">
									<a class="dark:bg-white text-white dark:text-black bg-neutral-800 p-1 flex items-center justify-center rounded-lg" href="#ToTop">
										<Icon class="" name="ri:arrow-up-s-line" size="1.8em" />
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
	const MarkedPostId = ref(false);

	onMounted(() => {
		if ($pwa.isInstalled) {
			Installed.value = true;
			setTimeout(() => {
				location.replace(`#ToBottem`);
			}, 3500);
		}
		$PusherOnStart();
	});

	const PostID = useRoute().params.post;
	const { data: Berichten, error, pending, refresh } = await useFetch(`/api/berichten/posts/${PostID}`);
	MarkedPostId.value = Berichten.value.Response.read;

	if (error.value) {
		throw createError({
			statusCode: 404,
			message: "The requested post could not be found",
			fatal: true,
		});
	}

	const store = useSessionsStore()
	
	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	const OpenMail = async (interested) => {
		const mailtoLink = createEmailTemplate(interested, Berichten);
		location.replace(mailtoLink);
	};

	const markMessage = async () => {
		const data = await $csrfFetch(`/api/berichten/posts/${PostID}`, {
			method: "PATCH",
		});

		MarkedPostId.value = data.Response;
	};
</script>
