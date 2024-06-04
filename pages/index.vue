<template>
	<div>
		<VitePwaManifest />
		<Landscape />
		<NuxtLink class="opacity-50 hover:opacity-80" to="/portfolio">Home</NuxtLink>
		<NuxtLink class="opacity-50 hover:opacity-80" to="/about">About</NuxtLink>
	</div>
</template>

<script setup>

	const { data } = await useFetch("/api/users");
	if(data.value.statusCode !== 200) await $fetch("/api/auth/refresh");

	definePageMeta({
		middleware: ["redirect"],
	});

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

</script>
