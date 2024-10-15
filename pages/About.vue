<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0 select-none">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto md:overflow-hidden">
				<div class="grid gap-24 z-40">
					<div class="flex select-none items-center justify-between">
						<Navigation :data />
						<div class="flex gap-4 items-center">
							<ClientOnly>
								<ColorMode />
								<Online />
								<button v-if="data?.statusCode == 200" @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
								<button v-else @click="HandleModule('Inloggen')" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">{{ textLabel }}</button>
							</ClientOnly>
						</div>
					</div>
				</div>

				<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[98%] lg:w-[88%] xl:w-[89.2%]">
					<div class="md:flex justify-between items-center">
						<h1 class="text-[1.5em] select-none text-black dark:text-white font-extrabold -mb-1">Curriculum Vitae</h1>
						<div class="flex gap-x-4 mt-4">
							<button @click="HandleModule('Contact')" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:send-plane-line" size="1.4em" /> </button>
							<a href="https://www.linkedin.com/in/roland-meijer-07bb97198/" target="_blank" class="flex items-center justify-center px-4 py-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"> <Icon class="mr-1" name="ri:external-link-line" size="1.2em" />Linkedin </a>
							<a :href="CVLink" target="_blank" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:file-pdf-2-line" size="1.4em" /> </a>
							<a :href="TelLink" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:phone-line" size="1.4em" /> </a>
							<a :href="MailLink" class="flex items-center justify-center p-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"><Icon class=" " name="ri:mail-send-line" size="1.4em" /> </a>
							
						</div>
					</div>

					<p class="mt-4 xl:mt-0 text-black dark:text-white opacity-70">
						
						Voor meer informatie over mijn werkervaring en opleidingen, kunt u mijn cv bekijken.
						<br />Heeft u vragen of wilt u contact met mij opnemen? Gebruik dan de contact knoppen hierboven.
					</p>

					<h2 class="mt-8 text-black dark:text-white font-bold">Leer mij kennen</h2>
					<div  class="mt-4 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-3 p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform">
						<div  v-for="(item, index) in items.data" :key="index">
							<CardAboutMe :item="item" :card="card" :toggleCard="toggleCard" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<ModalAuth v-model:type="datatype" v-model:texthead="title" v-model:textbase="subtitle" v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay" v-model:textLabel="buttonLabel" v-model:AuthModule="AuthModule"> </ModalAuth>
	</div>
</template>

<script setup>
	useSeoMeta({
		title: "PortFolio - About",
		description: "Geintereseerd in mijn curriculum vitae? Bekijk hem hier!",
		ogTitle: "PortFolio",
		ogDescription: "Geintereseerd in mijn curriculum vitae? Bekijk hem hier!!",
		ogImage: "/icons/test.png",
		ogUrl: "/",
		twitterTitle: "PortFolio",
		twitterDescription: "Geintereseerd in mijn curriculum vitae? Bekijk hem hier!!",
		twitterImage: "/icons/test.png",
		twitterCard: "summary",
	});

	useHead({
		htmlAttrs: { lang: "nl" },
		link: [{ rel: "icon", type: "image/png" }],
	});

	const { $pwa, $PusherOnStart, $csrfFetch } = useNuxtApp();
	const OpenModule = ref(false);
	const OpenModuleDelay = ref(false);
	const AuthModule = ref(true);
	const title = ref("");
	const subtitle = ref("");
	const buttonLabel = ref("");
	const textLabel = ref("Inloggen");
	const Installed = ref(false);
	const datatype = ref("");
	const CVLink = ref("./file/roland-cv.pdf");
	const TelLink = ref("tel:+31638305453");
	const MailLink = ref("mailto:rolandmeijer03@gmail.com");

	const card = ref({});

	const repoLink = ref();
	const currentPage = useLocalStorage("RepoPage").value;
	repoLink.value = `/Repos?Page=${currentPage}`;

	const store = useSessionsStore();
	const data = ref(await store.getSession());

	const Logout = async () => {
		store.clearSession();
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
	});

	const HandleModule = async (type) => {
		datatype.value = type;
		AuthModule.value = type != "Contact";
		title.value = type;
		buttonLabel.value = type == "Contact" ? "Maak contact" : "Login";
		subtitle.value = type == "Contact" ? "Vul hieronder je contact gegevens in en laat een bericht achter." : "Vul hieronder je gebruikersnaam en wachtwoord in om toegang te krijgen tot je account.";

		OpenModule.value = true;
		setTimeout(() => {
			OpenModuleDelay.value = true;
		}, 100);
	};

	const { data: items } = await useFetch("/api/about");

	items.value.data.forEach((item) => {
		card.value[item.action] = false;
	});

	const toggleCard = (type) => {
		card.value[type] = !card.value[type];

		if (card.value[type]) {
			for (const key in card.value) {
				if (key !== type) {
					card.value[key] = false;
				}
			}
		}
	};
</script>

<style scoped>
	::-webkit-scrollbar {
		@apply hidden;
	}
</style>
