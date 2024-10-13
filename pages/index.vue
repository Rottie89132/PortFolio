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

	

	const store = useSessionsStore();
	const result = ref(await store.getSession());
	

	if (result.value.statusCode !== 200) { navigateTo('/portfolio') }
	if (result.value.statusCode == 200 && result.value.authorized) { navigateTo('/dashboard') }
	if (result.value.statusCode == 200 && !result.value.authorized) { navigateTo('navigascript/profile') }

</script>
