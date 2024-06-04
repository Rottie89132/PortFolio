<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0 select-none dark:text-white">
			<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-8 lg:pl-36 xl:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto md:overflow-hidden">
				<div class="grid gap-24">
					<div class="flex select-none items-center justify-between">
						<NavLinksAdmin v-if="data?.statusCode == 200 && data.authorized" />
						<NavLinksUser v-else-if="data?.statusCode == 200 && !data.authorized" />
						<NavLinks v-else />
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
					<h1 class="text-[1.5em] select-none text-black dark:text-white font-extrabold -mb-1">Curriculum Vitae</h1>
					<ClientOnly>
						<div v-if="data?.statusCode != 401 && data?.statusCode != 428 && !error">
							<div class="-mb-3 select-none xl:-mb-2 hidden md:flex items-center justify-between">
								<div>
									<h3 class="text-[1.25em] dark:text-white text-black font-semibold mb-6 md:mb-3">Roland Meijer</h3>
								</div>
								<div class="flex gap-x-4 -mt-6">
									<a href="https://www.linkedin.com/in/roland-meijer-07bb97198/" target="_blank" class="px-4 py-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"> <Icon class="-mt-1 mr-1" name="ri:external-link-line" size="1.2em" />Linkedin </a>
									<a :href="datalink" download class="px-2 py-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
										<Icon class=" " name="ri:file-pdf-2-line" size="1.4em" />
									</a>
								</div>
							</div>
							<div class="select-none -mb-1 md:hidden">
								<div>
									<h3 class="text-[1.25em] dark:text-white text-black font-semibold mb-6 md:mb-3">Roland Meijer</h3>
								</div>
								<div class="flex gap-x-4">
									<a href="https://www.linkedin.com/in/roland-meijer-07bb97198/" target="_blank" class="px-4 py-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md"> <Icon class="-mt-1 mr-1" name="ri:external-link-line" size="1.2em" />Linkedin </a>
									<a :href="datalink" class="px-2 py-2 font-semibold dark:text-neutral-800 dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:bg-white dark:ring-white text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-md">
										<Icon class=" " name="ri:file-pdf-2-line" size="1.4em" />
									</a>
								</div>
							</div>
							<div v-auto-animate :class="isCardOpen('card1') ? 'h-[27.7vh] md:h-[31vh] xl:h-[29.5vh]' : 'h-fit'" class="p-2 bg-[#F7F7F7] dark:bg-[#111111] rounded-lg md:mt-5 mt-7 overflow-auto">
								<div class="flex select-none items-center justify-between">
									<h3 class="text-[1.1em] font-bold">Opleiding</h3>
									<div class="flex items-center gap-5">
										<div v-if="isCardOpen('card1')" class="flex items-center gap-2">
											<div class="w-4 h-4 bg-[#7DADAC] rounded-md"></div>
											<p class="text-sm">Afgrond</p>
										</div>
										<div v-if="isCardOpen('card1')" class="flex items-center gap-2">
											<div class="w-4 h-4 bg-[#7D82AD] rounded-md"></div>
											<p class="text-sm">Actief</p>
										</div>
										<button class="md:hidden" @click="toggleCard('card1')">
											<Icon name="ic:baseline-keyboard-arrow-down" size="1.4em"></Icon>
										</button>
									</div>
								</div>
								<div v-if="isCardOpen('card1')" class="grid gap-2 mt-2 h-[84%] overflow-auto snap-y snap-proximity scroll-smooth">
									<div class="flex p-2 bg-white dark:bg-neutral-900 rounded-lg snap-start">
										<div class="w-full">
											<div class="flex items-center gap-2">
												<Icon class="text-[#7D82AD] select-none" name="mdi:clock-time-seven" size="1.4em"> </Icon>
												<h1 class="text-sm font-black">Grafisch Lyceum Rotterdam</h1>
											</div>
											<div class="flex items-center justify-between">
												<h3 class="text-xs font-normal">Student, Software dev, <span class="text-[0.7em]">4 BOL</span></h3>
												<h3 class="text-xs font-normal">aug. 2022 - nu</h3>
											</div>
										</div>
									</div>
									<div class="flex p-2 bg-white dark:bg-neutral-900 rounded-lg snap-start">
										<div class="w-full">
											<div class="flex items-center gap-2">
												<Icon class="text-[#7DADAC] select-none" name="material-symbols-light:check-circle" size="1.4em"></Icon>
												<h1 class="text-sm font-black">Woonstad Rotterdam</h1>
											</div>
											<div class="flex items-center justify-between">
												<h3 class="text-xs font-normal">Stagiair, ict helpdesk</h3>
												<h3 class="text-xs font-normal">sep. 2021 - feb. 2022</h3>
											</div>
										</div>
									</div>
									<div class="flex p-2 bg-white dark:bg-neutral-900 rounded-lg snap-start">
										<div class="w-full">
											<div class="flex items-center gap-2">
												<Icon class="text-[#7DADAC] select-none" name="material-symbols-light:check-circle" size="1.4em"></Icon>
												<h1 class="text-sm font-black">Da Vinci College Dordrecht</h1>
											</div>
											<div class="flex items-center justify-between">
												<h3 class="text-xs font-normal">Student, Frontend dev, <span class="text-[0.7em]">3 BOL</span></h3>
												<h3 class="text-xs font-normal">aug. 2020 - jul. 2022</h3>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="md:grid grid-cols-2 gap-4 md:mt-2 select-text">
								<div v-auto-animate class="p-2 bg-[#F7F7F7] dark:bg-[#111111] rounded-lg mt-2 overflow-auto">
									<div class="flex items-center justify-between">
										<h3 class="text-[1.1em] select-none font-bold">Persoonlijk</h3>
										<button class="md:hidden" @click="toggleCard('card2')">
											<Icon name="ic:baseline-keyboard-arrow-down" size="1.4em"></Icon>
										</button>
									</div>
									<div v-if="isCardOpen('card2')" class="grid md:hidden grid-cols-3 grid-rows-2 gap-2 p-2 mt-2 bg-white dark:bg-neutral-900 rounded-lg">
										<div>
											<h2 class="text-xs font-bold">Geb datum</h2>
											<h3 class="text-xs">03-12-2001</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Woonplaats</h2>
											<h3 class="text-xs">Vlaardingen</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Nationaliteit</h2>
											<h3 class="text-xs">Nederlands</h3>
										</div>
										<div @click="OpenMail">
											<h2 class="text-xs font-bold">Email</h2>
											<h3 class="text-xs truncate">RolandMeijer03@gmail.com</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Telefoon</h2>
											<h3 class="text-xs">06 38305453</h3>
										</div>
									</div>
									<div class="hidden md:grid grid-cols-3 grid-rows-2 gap-2 p-2 mt-2 bg-white dark:bg-neutral-900 rounded-lg">
										<div>
											<h2 class="text-xs font-bold">Geb datum</h2>
											<h3 class="text-xs">03-12-2001</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Woonplaats</h2>
											<h3 class="text-xs">Vlaardingen</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Nationaliteit</h2>
											<h3 class="text-xs">Nederlands</h3>
										</div>
										<div @click="OpenMail">
											<h2 class="text-xs font-bold">Email</h2>
											<h3 class="text-xs truncate">RolandMeijer03@gmail.com</h3>
										</div>
										<div>
											<h2 class="text-xs font-bold">Telefoon</h2>
											<h3 class="text-xs">06 38305453</h3>
										</div>
									</div>
								</div>
								<div v-auto-animate class="p-2 bg-[#F7F7F7] dark:bg-[#111111] rounded-lg mt-2 overflow-auto">
									<div class="flex items-center justify-between">
										<h3 class="text-[1.1em] select-none font-bold">Vaardigheden</h3>
										<button class="md:hidden" @click="toggleCard('card3')">
											<Icon name="ic:baseline-keyboard-arrow-down" size="1.4em"></Icon>
										</button>
									</div>
									<div v-if="isCardOpen('card3')" class="flex md:hidden justify-between gap-3 p-2 md:pb-4 mt-2 text-xs bg-white dark:bg-neutral-900 rounded-lg">
										<div>
											<p>Vue.js</p>
											<p>Nuxt.js</p>
											<p>Express.js</p>
											<p>Asp.net</p>
										</div>
										<div>
											<p>SQL</p>
											<p>MongoDB</p>
											<p>Websocket</p>
											<p>Node.js</p>
										</div>
										<div>
											<p>HTML</p>
											<p>CSS</p>
											<p>JS</p>
											<p>PHP</p>
										</div>
										<div>
											<p>Git</p>
											<p>Figma</p>
											<p>Netwerk beheer</p>
											<p>Virtual machines</p>
										</div>
									</div>
									<div class="hidden md:flex justify-between gap-3 p-2 md:pb-4 mt-2 text-xs bg-white dark:bg-neutral-900 rounded-lg">
										<div>
											<p>Vue.js</p>
											<p>Nuxt.js</p>
											<p>Express.js</p>
											<p>Asp.net</p>
										</div>
										<div>
											<p>SQL</p>
											<p>MongoDB</p>
											<p>Websocket</p>
											<p>Node.js</p>
										</div>
										<div>
											<p>HTML</p>
											<p>CSS</p>
											<p>JS</p>
											<p>PHP</p>
										</div>
										<div>
											<p>Git</p>
											<p>Figma</p>
											<p>Netwerk beheer</p>
											<p>Virtual machines</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div v-else>
							<p class="mt-3 mb-4 leading-4 dark:text-white text-sm">Om toegang te krijgen tot mijn informatie moet je een account hebben en ingelogd zijn.</p>
							<button @click="HandleModule('Aanmelden')" class="px-4 py-1 text-sm font-semibold dark:ring-white text-white dark:hover:bg-gray-100 dark:hover:ring-gray-100 dark:text-neutral-800 dark:bg-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-lg">Aanmelden</button>
							<div :class="Installed ? ' max-h-[63.5vh]' : 'max-h-[68.5vh]'" class="mt-3 md:mt-6 dark:text-black rounded-md overflow-auto text-white grid grid-cols-2 md:grid-cols-3 gap-3">
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:vuejs" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:nuxtjs" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:nodejs" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:javascript" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:php" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:git" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:mysql-wordmark" size="8em"></icon>
								</div>
								<div class="dark:bg-white bg-neutral-800 p-2 flex items-center justify-center rounded-md">
									<icon name="devicon-plain:mongodb-wordmark" size="8em"></icon>
								</div>
								<div class="dark:bg-white hidden md:flex bg-neutral-800 p-2 items-center justify-center rounded-md"></div>
							</div>
						</div>
					</ClientOnly>
				</div>
			</div>
		</div>
		<ModalBase v-model:texthead="title" v-model:type="datatype" v-model:textbase="subtitle" v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay" v-model:textLabel="buttonLabel" v-model:AuthModule="AuthModule">
			<div v-if="AuthModule && datatype != 'Vergeten'">
				<FieldInput :name="'email'" :type="'email'" :label="'Gebuikersnaam'" />
				<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
			</div>
			<div v-else-if="datatype == 'Vergeten'">
				<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
				<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Nieuwe wachtwoord'" />
				<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
			</div>
			<div v-else>
				<FieldInput :name="'email'" :type="'email'" :label="'Email'" />
				<FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
				<FieldInput :name="'confirmatie'" :type="'password'" :label="'Confirmatie'" />
			</div>
		</ModalBase>
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
	const datalink = ref("");

	const openCard = ref("card1");
	const windowScreen = ref();

	const repoLink = ref();
	const currentPage = useLocalStorage("RepoPage").value;
	repoLink.value = `/Repos?Page=${currentPage}`;

	const { data, error, pending, refresh } = await useFetch("/api/users");
	if (data.value.statusCode !== 200) {
		const refresh = await $fetch("/api/auth/refresh");
		data.value = refresh;
	}

	const Logout = async () => {
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};

	const handleResize = () => {
		windowScreen.value = window.innerWidth >= 768;
		if (windowScreen.value) openCard.value = "card1";
	};

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();
		datalink.value = `./file/roland-cv.png`;

		handleResize();
		window.addEventListener("resize", handleResize);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", handleResize);
	});

	const HandleModule = async (type) => {
		datatype.value = type;
		AuthModule.value = type != "Aanmelden";
		title.value = type;
		buttonLabel.value = type == "Aanmelden" ? "Aanmelden" : "Login";
		subtitle.value = type == "Aanmelden" ? "Vul hieronder je gegevens in om een account aan te maken." : "Vul hieronder je gebruikersnaam en wachtwoord in om toegang te krijgen tot je account.";

		OpenModule.value = true;
		setTimeout(() => {
			OpenModuleDelay.value = true;
		}, 100);
	};

	const toggleCard = (cardId) => {
		if (openCard.value === cardId) {
			openCard.value = null;
		} else {
			openCard.value = cardId;
		}
	};

	const isCardOpen = (cardId) => {
		return openCard.value === cardId;
	};

	const OpenMail = async () => {
		location.replace(`mailto:RolandMeijer03@gmail.com?subject=Portfolio%20Curriculum%20Vitae`);
	};
</script>

<style scoped>
	::-webkit-scrollbar {
		@apply hidden;
	}
</style>
