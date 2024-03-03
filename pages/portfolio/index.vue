<template>
	<VitePwaManifest />
	<Landscape />
	<div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0 select-none">
		<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 md:rounded-none rounded-3xl md:pl-52 bg-gradient-to-r from-teal-50 to-yellow-50 dark:from-[#131313] dark:to-[#22221E]">
			<div class="grid gap-24">
				<div class="flex items-center justify-between">
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
				<div class="items-center w-full h-[60vh] md:flex">
					<div class="grid gap-8 md:gap-4">
						<HeaderTitel Title="Hallo leer mij kennen!" SubTitle="Hoi, ik ben Roland Meijer, een Software Developer in de maak! Momenteel zit ik in mijn tweede leerjaar en ontdek ik de kunst van het programmeren." />
						<div class="flex items-center gap-5">
							<ClientOnly>
								<NuxtLink :to="repoLink" class="flex dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white items-center gap-2 px-5 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-xl"> Bekijk Repositories </NuxtLink>
								<template #fallback>
									<NuxtLink to="/Repos" class="flex dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white items-center gap-2 px-5 py-3 text-sm text-white bg-neutral-800 hover:bg-neutral-900 ring-2 hover:ring-neutral-900 ring-neutral-800 rounded-xl"> Bekijk Repositories </NuxtLink>
								</template>
							</ClientOnly>

							<button @click="HandleModule('Contact')" class="px-6 py-3 dark:hover:text-white dark:ring-white dark:hover:ring-white text-sm font-semibold dark:text-white text-neutral-800 hover:text-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900 rounded-xl">Contact</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ModalBase v-model:type="datatype" v-model:texthead="title" v-model:textbase="subtitle" v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay" v-model:textLabel="buttonLabel" v-model:AuthModule="AuthModule">
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
			<FieldInput :name="'naam'" :type="'name'" :label="'Contact persoon'" />
			<FieldInput :name="'email'" :type="'email'" :label="'Email adress'" />
			<FieldTextarea :name="'bericht'" :type="'bericht'" :label="'bericht'" />
			<FieldInput :name="'telefoon'" :value="'+31 06 12 34 56 78'" :type="'phone'" :label="'Telefoon'" />
		</div>
	</ModalBase>
</template>

<script setup>
	useSeoMeta({
		title: "PortFolio - Home",
		description: "Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!",
		ogTitle: "PortFolio",
		ogDescription: "Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!",
		ogImage: "/icons/test.png",
		ogUrl: "/",
		twitterTitle: "PortFolio",
		twitterDescription: "Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!!",
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
	const repoLink = ref("");
	const currentPage = useLocalStorage("RepoPage").value;
	repoLink.value = `/Repos?Page=${currentPage || 1}`;

	const { data, error, pending, refresh } = await useFetch("/api/users");

	if (useRoute().query.Page) navigateTo("/");

	const Logout = async () => {
		await $csrfFetch("/api/users", { method: "DELETE" });
		return location.reload();
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
</script>
