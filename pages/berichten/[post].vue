<template>
    <VitePwaManifest />
    <Landscape />
    <div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'"
            class="w-full select-none md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
            <div class="grid gap-24">
                <div class="flex items-center justify-between md:mt-[0.15em]">
                    <button aria-label="GaTerug"
                        class=" dark:bg-white text-white dark:text-black bg-neutral-800 p-2 flex items-center justify-center rounded-lg"
                        @click="$router.back()">
                        <Icon class="text-white dark:text-black" name="ri:arrow-left-fill" size="1.2em" />
                    </button>
                    <div class="flex gap-4 items-center">
                        <ClientOnly>
                            <ColorMode />
                            <Online />
                            <button @click="Logout"
                                class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">
                                Uitloggen
                            </button>

                        </ClientOnly>
                    </div>
                </div>
            </div>
            <div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]">
                <h1 class="text-2xl dark:text-white font-bold">Bericht</h1>
                <div class=" whitespace-pre-wrap scroll-smooth leading-[1.30em] break-words text-balance max-h-[75vh] w-full bg-white dark:bg-neutral-900 p-4 rounded-lg mt-2 dark:text-white ">
                    <div class=" max-h-[71vh] scroll-smooth overflow-auto ">
                        <span id="ToTop" class=" md:hidden -ml-1"></span>
                        {{ Berichten.Response.message }}
                        <div v-if="Berichten.Response.message.length > 600"
                            class=" md:hidden p-2 -mt-2 flex items-center justify-end" id="ToBottem">
                            <a class="dark:bg-white text-white dark:text-black bg-neutral-800 p-1 flex items-center justify-center rounded-lg"
                                href="#ToTop">
                                <Icon class="" name="ri:arrow-up-s-line" size="1.8em" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
useSeoMeta({
    title: 'PortFolio - Berichten',
    description: 'Welkom op mijn portfolio website!',
    ogTitle: 'PortFolio',
    ogDescription: 'Welkom op mijn portfolio website!',
    ogImage: '/icons/test.png',
    ogUrl: '/',
    twitterTitle: 'PortFolio',
    twitterDescription: 'Welkom op mijn portfolio website!',
    twitterImage: '/icons/test.png',
    twitterCard: 'summary',
});

useHead({
    htmlAttrs: { lang: 'nl' },
    link: [{ rel: 'icon', type: 'image/png' }],
});

definePageMeta({
    middleware: ["user-auth"],
});

const { $pwa, $csrfFetch, $PusherOnStart } = useNuxtApp();
const Installed = ref(false);


onMounted(() => {
    if ($pwa.isInstalled) Installed.value = true;
    $PusherOnStart();
    setTimeout(() => {
        location.replace(`#ToBottem`)
    }, 3500)
});

const PostID = useRoute().params.post;
const { data: Berichten, error } = await useFetch(`/api/berichten/posts/${PostID}`)

if (error.value) {
    throw createError({
        statusCode: 404,
        message: error.value.data.message,
        statusMessage: "De aangevraagde pagina is niet gevonden!",
        fatal: true,
    })
}

const Logout = async () => {
    await $csrfFetch('/api/users', { method: 'DELETE' }); return navigateTo('/');
};


</script>
