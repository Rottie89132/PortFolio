<template>
	<VitePwaManifest />
	<Landscape />
	<div class="fixed select-none w-full h-full p-4 pb-5 md:pb-0 md:p-0">
		<div :class="!Installed ? 'h-full' : 'h-[95%]'" class="w-full md:h-full p-5 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 md:overflow-hidden overflow-auto">
			<div class="grid gap-24">
				<div class="flex items-center justify-between">
					<NavLinksAdmin v-if="data?.statusCode == 200 && data.authorized" />
					<NavLinksUser v-else />
					<div class="flex gap-4 items-center">
						<ClientOnly>
							<ColorMode />
							<button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
						</ClientOnly>
					</div>
				</div>
			</div>
			<div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]">
				<h1 class="text-[1.5em] dark:text-white text-black font-extrabold mb-3">Profiel</h1>
				<div class="grid grid-cols-1 gap-3">
					<div class="bg-indigo-600 dark:bg-indigo-500 p-4 rounded-xl">
						<div class="flex items-center justify-between">
							<h1 class="text-xl text-white font-extrabold">{{ username }}</h1>
							<Icon @click="AccountDetails" class="text-white" name="ic:sharp-settings" size="1.6em" />
						</div>
						<h2 class="text-[0.8em] text-white opacity-75 font-semibold mb-2">{{ email }}</h2>
						<div class="flex items-center gap-2">
							<div class="py-1 px-4 rounded-lg text-black font-medium text-[0.8em] bg-white">{{ userAuthorized ? "Eigenaar" : "Bezoeker" }}</div>
							<div v-if="TwoFAEnabled" class="py-1 px-4 rounded-lg text-black font-medium text-[0.8em] bg-white">2FA</div>
						</div>
					</div>
					<div class="grid grid-cols-4 gap-4">
						<div v-for="i in 4">
							<div class="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg"></div>
						</div>
					</div>
					<div class="grid gap-x-4 gap-y-3 md:grid-cols-2">
						<div v-if="!userAuthorized" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex items-center justify-between">
								<h1 class="text-xl dark:text-white font-extrabold mb-1">Berichten</h1>
								<ClientOnly>
									<NuxtLink :to="berichtenLink" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right">Bekijk alle berichten</NuxtLink>
									<template #fallback>
										<NuxtLink to="/berichten" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right">Bekijk alle berichten</NuxtLink>
									</template>
								</ClientOnly>
							</div>
							<p class="text-[0.7em] dark:text-white opacity-75 font-medium leading-4">
								{{ readObjects.length > 0 ? "Je hebt " : "Je hebt nog geen" }}
								{{ readObjects.length > 0 ? readObjects.length : "" }}
								{{ readObjects.length > 0 ? (readObjects.length == 1 ? "nieuw bericht ontvangen, check je mailbox!" : "nieuw berichten ontvangen, check je mailbox! ") : "berichten ontvangen, stuur een bericht. Of wacht tot je een bericht ontvangt." }}
							</p>
						</div>
						<div v-if="!userAuthorized" class="overflow-auto bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex items-center justify-between">
								<h1 class="text-xl dark:text-white font-extrabold mb-1">Projecten</h1>
								<ClientOnly>
									<NuxtLink :to="repoLink" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right">Bekijk alle projecten</NuxtLink>
									<template #fallback>
										<NuxtLink to="/Repos" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right">Bekijk alle projecten</NuxtLink>
									</template>
								</ClientOnly>
							</div>
							<!-- <p class="text-[0.7em] dark:text-white opacity-75 leading-4 font-medium" v-if="loading">Even wachten we zijn jouw gemarkeerde projecten aan het ophalen.</p> -->
							<div :class="savedLikes.length < 4 ? ' gap-[0.45rem]' : ' gap-[0.6rem]'" class="snap-x snap-proximity scroll-smooth w-full rounded-lg overflow-auto flex items-center mt-1" v-if="savedLikes.length > 0">
								<div class="snap-start bg-black dark:bg-white p-[0.41rem] px-3 rounded-lg font-semibold text-[0.65em] dark:text-black text-white" v-for="item in savedLikes">
									<a class="flex items-center gap-[0.28rem]" v-if="item.visibility == 'public'" :href="item.url" target="_blank"> <Icon class=" " name="ri:external-link-line" size="1.2em" />{{ item.name }} </a>
									<span class="cursor-not-allowed flex items-center gap-[0.28rem]" v-else> <icon name="ri:lock-2-line" size="1.2em" />{{ item.name }} </span>
								</div>
							</div>
							<p v-else class="text-[0.7em] dark:text-white opacity-75 leading-4 font-medium">Je hebt nog geen projecten gemarkeerd, klik op het duimpje om een project te markeren.</p>
						</div>
					</div>
					<div v-if="userAuthorized" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
						<div class="flex items-center justify-between">
							<h1 class="text-xl dark:text-white font-extrabold mb-1">Curriculum Vitae</h1>
							<NuxtLink to="/about" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right"> Bekijken</NuxtLink>
						</div>
						<p class="text-[0.7em] dark:text-white opacity-75 leading-4 font-medium">Hier bevindt zich de optie om de inhoud van de 'About'-pagina te bewerken naar jouw wensen</p>
						<button @click="FileUpload" class="mt-2 px-4 py-1 rounded-lg text-white dark:text-black bg-black dark:bg-white font-medium text-[0.8em]">Bewerken</button>
					</div>
					<div class="grid md:grid-cols-3 gap-y-3 gap-x-4">
						<div @click="PasswordChange" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex md:items-start items-center gap-3">
								<icon class="text-indigo-600 dark:text-indigo-500" name="charm:shield-keyhole" size="2em" />
								<div>
									<h1 class="text-base dark:text-white font-extrabold">Wachtwoord</h1>
									<p class="text-[0.7em] dark:text-white opacity-75 leading-4 -mt-1 md:-mt-0 font-medium">Klik hier om je wachtwoord aan te passen.</p>
								</div>
							</div>
						</div>
						<div v-if="!TwoFAEnabled" @click="AddTwoFactor" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex md:items-start items-center gap-3">
								<icon class="text-indigo-600 dark:text-indigo-500" name="charm:shield-tick" size="2em" />
								<div>
									<h1 class="text-base dark:text-white font-extrabold">Tweestapsverificatie</h1>
									<p class="text-[0.7em] dark:text-white opacity-75 leading-4 -mt-1 md:-mt-0 font-medium">hier kan je 2FA inschakelen voor je account.</p>
								</div>
							</div>
						</div>
						<div v-else @click="RemoveTwoFactor" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex md:items-start items-center gap-3">
								<icon class="text-indigo-600 dark:text-indigo-500" name="charm:shield-tick" size="2em" />
								<div>
									<h1 class="text-base dark:text-white font-extrabold">Tweestapsverificatie</h1>
									<p class="text-[0.7em] dark:text-white opacity-75 leading-4 -mt-1 md:-mt-0 font-medium">hier kan je 2fa uitschakelen voor je account.</p>
								</div>
							</div>
						</div>
						<div @click="AccountDeletion" class="bg-[#F7F7F7] dark:bg-[#111111] p-4 rounded-xl">
							<div class="flex md:items-start items-center gap-3">
								<icon class="text-indigo-600 dark:text-indigo-500" name="charm:shield-cross" size="2em" />
								<div>
									<h1 class="text-base dark:text-white font-extrabold">Account verwijderen</h1>
									<p class="text-[0.7em] dark:text-white opacity-75 leading-4 -mt-1 md:-mt-0 font-medium">Deze actie niet kan worden teruggedraaid.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ModalUpload v-model:status="OpenUploadModule" v-model:DelayStatus="OpenUploadModuleDelay" v-model:title="title" />
	<ModalVerification v-model:username="username" v-model:email="email" v-model:type="type" v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay" v-model:title="title">
		<Action2fa v-if="type == '2fa'" v-model:Generated="Generated" />
		<ActionDeletion v-model:status="OpenModule" v-model:DelayStatus="OpenModuleDelay" v-else-if="type == 'delete'" />
	</ModalVerification>
</template>

<script setup>
	definePageMeta({
		middleware: ["user-auth"],
	});

	useSeoMeta({
		title: "Profiel - Home",
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

	const { $pwa, $PusherOnStart, $csrfFetch } = useNuxtApp();
	const OpenModule = ref(false);
	const OpenModuleDelay = ref(false);
	const Installed = ref(false);
	const Generated = ref();
	const TwoFAEnabled = ref(false);
	const repoLink = ref();
	const berichtenLink = ref();
	const userAuthorized = ref();
	const savedLikes = ref([]);
	const loading = ref(true);
	const type = ref("");
	const title = ref("");
	const OpenUploadModule = ref(false);
	const OpenUploadModuleDelay = ref(false);
	const readObjects = ref([]);

	const username = ref("");
	const email = ref("");

	const berichten = useLocalStorage("BerichtenPage", 1).value;
	const currentPage = useLocalStorage("RepoPage").value;
	repoLink.value = `/Repos?Page=${currentPage || 1}`;
	berichtenLink.value = `/berichten?Page=${berichten || 1}`;

	const { data } = await useFetch("/api/users");

	if (data.value.authorized) {
		const { data: Berichten } = await useFetch(`/api/berichten/`);
		readObjects.value = Berichten.value.Response.filter((obj) => obj.read === true);
	} else {
		const { data: likes, error } = await useFetch("/api/repo/liked");
		if (!error.value) savedLikes.value = likes.value.data;
	}

	TwoFAEnabled.value = data.value.user.is2FAEnabled;
	userAuthorized.value = data.value.authorized;
	username.value = data.value.user.Username;
	email.value = data.value.user.Email;

	onMounted(() => {
		if ($pwa.isInstalled) Installed.value = true;
		$PusherOnStart();

		loading.value = false;
	});

	const PasswordChange = async () => {
		type.value = "password";
		title.value = "Wachtwoord";
		animate();
	};

	const FileUpload = async () => {
		type.value = "upload";
		title.value = "Uploaden";
		OpenUploadModule.value = true;
		setTimeout(() => {
			OpenUploadModuleDelay.value = true;
		}, 100);
	};

	const AccountDeletion = async () => {
		type.value = "delete";
		title.value = "Account";
		animate();
	};

	const AccountDetails = async () => {
		type.value = "details";
		title.value = "Profiel";
		animate();
	};

	const AddTwoFactor = async () => {
		const data = await $fetch("/api/auth/opt/generate");
		Generated.value = data;
		type.value = "2fa";
		title.value = "2FA verificatie";

		animate();
		setTimeout(() => {
			TwoFAEnabled.value = true;
		}, 1000);
	};

	const animate = async () => {
		OpenModule.value = true;
		setTimeout(() => {
			OpenModuleDelay.value = true;
		}, 100);
	};

	const RemoveTwoFactor = async () => {
		const data = await $csrfFetch("/api/auth/opt", { method: "DELETE" });
		if (data.statusCode == 200) TwoFAEnabled.value = false;
	};

	const Logout = async () => {
		await $csrfFetch("/api/users", { method: "DELETE" });
		return navigateTo("/");
	};
</script>
