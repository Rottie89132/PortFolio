<template>
    <VitePwaManifest />
    <div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0 select-none ">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'"
            class="w-full md:h-full p-5 md:rounded-none rounded-3xl md:pl-52 bg-gradient-to-r from-teal-50 to-yellow-50 dark:from-[#131313] dark:to-[#22221E]">
            <div class="grid gap-24 ">
                <div class="flex items-center justify-between ">
                    <NavLinks />
                    <div class=" flex gap-4 items-center">
                        <ClientOnly>
                            <ColorMode />
                        </ClientOnly>
                    </div>
                </div>
                <div class="items-center w-full h-[60vh] md:flex ">
                    <div class="grid gap-8 md:gap-4">
                        <div class="flex items-center gap-5">
                            <div class="flex flex-col gap-2">
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>


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

const { $pwa } = useNuxtApp()
const Installed = ref(false)

onMounted(() => {
    if ($pwa.isInstalled) Installed.value = true
})





</script>

<!-- // if (data.value.statusCode == 200 && data.value.authorized) {
//     textLabel.value = "Dashboard"
// }

// if (data.value.statusCode == 200 && !data.value.authorized) {
//     textLabel.value = "Profiel"
// } -->