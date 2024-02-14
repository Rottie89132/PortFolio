<template>
    <VitePwaManifest />
    <Landscape />
</template>


<script setup>

definePageMeta({
    middleware: ["redirect"],
});

useSeoMeta({
    title: 'PortFolio - Home',
    description: 'Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!',
    ogTitle: 'PortFolio',
    ogDescription: 'Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!',
    ogImage: '/icons/test.png',
    ogUrl: '/',
    twitterTitle: 'PortFolio',
    twitterDescription: 'Welkom op de startpagina van mijn portfolio-website! Neem gerust een kijkje en laat een berichtje achter!!',
    twitterImage: '/icons/test.png',
    twitterCard: 'summary'
})

useHead({
    htmlAttrs: { lang: 'nl' },
    link: [{ rel: 'icon', type: 'image/png' }]
})


</script>