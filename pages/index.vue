<template>
	<div>
		<VitePwaManifest />
		<Landscape />
	</div>
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


	const result = ref()

	const { data } = await useFetch('/api/users')
	result.value = data.value

	if (process.client) {

		if (result.value.statusCode !== 200) {
			const refresh = await $fetch("/api/auth/refresh");
			result.value = refresh;
		}

		if (result.value.statusCode !== 200) { navigateTo('/portfolio') }
		if (result.value.statusCode == 200 && result.value.authorized) { navigateTo('/dashboard') }
		if (result.value.statusCode == 200 && !result.value.authorized) { navigateTo('/profile') }
	}

</script>
