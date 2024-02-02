<template>
    <VitePwaManifest />
    <div class="fixed w-full h-full p-4 pb-5 md:pb-0 md:p-0">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'"
            class="w-full select-none md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
            <div class="grid gap-24">
                <div class="flex items-center justify-between md:mt-[0.15em]">
                    <NavLinksAdmin v-if="data?.statusCode == 200 && data.authorized" />
                    <NavLinksUser v-else-if="data?.statusCode == 200 && !data.authorized" />
                    <NavLinks v-else />
                    <div class="flex gap-4 items-center">
                        <ClientOnly>
                            <ColorMode />
                            <Online />
                            <button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">
                                Uitloggen
                            </button>
                            
                        </ClientOnly>
                    </div>
                </div>
            </div>
            <div class="w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]">
                <div
                    class="bg-[#F7F7F7] dark:bg-[#111111] dark:text-white md:bg-[#F7F7F7] md:dark:bg-[#111111] p-4 rounded-xl">
                    <h1 class="text-2xl font-bold">Bericht</h1>
                    <h2 class="text-base -mt-1 font-bold opacity-70">{{ PostID }}</h2>
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
const OpenModule = ref(false);
const OpenModuleDelay = ref(false);
const AuthModule = ref(true);
const title = ref('');
const subtitle = ref('');
const buttonLabel = ref('');
const textLabel = ref('Inloggen');

onMounted(() => {
    if ($pwa.isInstalled) Installed.value = true;
    $PusherOnStart();
});

const PostID = useRoute().params.post;
const { data, error, pending, refresh } = await useFetch('/api/users');

const Logout = async () => {
    await $csrfFetch('/api/users', { method: 'DELETE' }); return navigateTo('/');
};

const HandleModule = async type => {
    if (data.value?.statusCode == 200 && type == 'Inloggen' && data.value?.authorized) return navigateTo('/dashboard');
    if (data.value?.statusCode == 200 && type == 'Inloggen' && !data.value?.authorized) return navigateTo('/profile');

    AuthModule.value = type != 'Contact';
    title.value = type;
    buttonLabel.value = type == 'Contact' ? 'Maak contact' : 'Login';
    subtitle.value = type == 'Contact' ? 'Vul hieronder je contact gegevens in en laat een bericht achter.' : 'Vul hieronder je gebruikersnaam en wachtwoord in om toegang te krijgen tot je account.';

    OpenModule.value = true;
    setTimeout(() => {
        OpenModuleDelay.value = true;
    }, 100);
};
</script>
