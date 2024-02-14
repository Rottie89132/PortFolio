<template>
    <VitePwaManifest />
    <Landscape />
    <div class="fixed select-none  w-full h-full p-4 pb-5 md:pb-0 md:p-0">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'"  class="w-full md:h-full p-5 pb-4 md:rounded-none rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto md:overflow-hidden xl:overflow-hidden">
            <div class="grid gap-24 ">
                <div class="flex items-center justify-between ">
                    <NavLinksAdmin />
                    <div class=" flex gap-4 items-center">
                        <ClientOnly>
                            <ColorMode/>
                            <button @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
                        </ClientOnly> 
                    </div>
                </div>
            </div>
            <div class=" w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]  ">
                <h1 class="text-[1.5em] text-black dark:text-white font-extrabold mb-3 ">Analytics</h1>
                <div class="flex items-center justify-between gap-8 mb-6 md:justify-normal ">
                    <div >
                        <p class="font-black dark:text-white ">Bezoekers</p>
                        <p class="leading-[1.1em] dark:text-white text-sm">Er zijn <span class="font-black ">{{ MonthlyVisted }}</span> bezoekers geweest deze maand</p>
                    </div>
                    <div>
                        <p class="font-black dark:text-white ">Berichten</p>
                        <p class="leading-[1.1em] dark:text-white text-sm">Er zijn <span class="font-black ">{{ MonthlyMessages }}</span> berichten verzonden deze maand</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 mb-3">
                    <h1 class="text-[1.2em] dark:text-white text-black font-extrabold ">Recent toevoeged</h1>
                    <ClientOnly>
                        <NuxtLink :to="`/dashboard/Repos?Page=${currentPage}`" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right ">Bekijken</NuxtLink>
                        <template #fallback>
                            <NuxtLink to="/dashboard/Repos" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right ">Bekijken</NuxtLink>
                        </template>
                    </ClientOnly>
                </div>
                <div class="mb-[4.85em] -mt-2" v-if="Repos.length < 1">
                    <p class="opacity-75 mb-4 dark:text-white ">Je hebt nog geen repositories toegevoegd!</p>
                    <ClientOnly>
                        <NuxtLink :to="`/dashboard/Repos?Page=${currentPage}`" class="px-4 py-2 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600">Toevoegen</NuxtLink>
                        <template #fallback>
                            <NuxtLink to="/dashboard/Repos" class="px-4 py-2 text-sm font-medium text-white dark:bg-indigo-500 dark:ring-indigo-500 bg-indigo-600 rounded-lg ring-2 ring-indigo-600">Toevoegen</NuxtLink>
                        </template>
                    </ClientOnly>
                </div>
                <div v-else :class="Repos.length <= 2 ? 'h-fit' : Messages.length > 2 ? 'h-[15.6svh] md:h-[17.3svh] xl:h-[15.5svh]' : 'h-[22.4svh] md:h-[25svh] xl:h-[22.5svh]'" class=" p-3 bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl mb-6 ">
                    <div class="w-full h-full overflow-y-auto md:pr-2 rounded-xl snap-y snap-proximity scroll-smooth ">
                        <div v-for="(item, index) in Repos" :key="index" :id="`Repo:${index}`" class="w-full p-3 mb-3 bg-white dark:bg-neutral-900 last:mb-0 snap-start rounded-xl h-fit">
                            <div class="flex items-center justify-between gap-2 ">
                                <div class="flex items-center gap-2 ">
                                    <NuxtImg draggable="false" :src="item.owner.avatar_url" class="w-5 rounded-full"></NuxtImg>
                                    <h2 class="text-sm font-bold dark:text-white">{{item.owner.name}}</h2>
                                </div>
                                <div class=" flex items-center gap-2 ">
                                    <a :href="item.html_url" target="_blank" class="text-xs font-medium dark:text-indigo-500 text-indigo-600 ">{{ item.name }}</a>
                                    <icon name="ri:external-link-line" class=" text-indigo-600 dark:text-indigo-500" size="1em"></icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 mb-3">
                    <h1 class="text-[1.2em] dark:text-white text-black font-extrabold ">Recente berichten</h1>
                    <ClientOnly>
                        <NuxtLink :to="`/dashboard/Berichten?Page=${currentPageBerichten}`" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right ">Bekijken</NuxtLink>
                        <template #fallback>
                            <NuxtLink to="`/dashboard/Berichten" class="text-indigo-600 dark:text-indigo-500 text-[0.65em] text-right ">Bekijken</NuxtLink>
                        </template>
                    </ClientOnly>
                    
                </div>
                <div class="mb-6 -mt-2" v-if="Messages.length < 1">
                    <p class="opacity-75 dark:text-white">Je hebt nog geen berichten ontvangen</p>
                </div>
                <div v-else :class="Messages.length < 3 ? 'h-fit' : 'h-[35vh] md:h-[25.5vh] xl:h-[24.7vh]'" class=" p-3 bg-[#F7F7F7] dark:bg-[#111111] rounded-2xl ">
                    <div class="w-full h-full overflow-y-auto rounded-xl snap-y snap-proximity scroll-smooth ">
                        <div v-for="(item, index) in Messages" class="w-full p-3 mb-3 bg-white dark:bg-neutral-900 last:mb-0 rounded-xl md:snap-end snap-center h-fit" @click="navigateTo(`/dashboard/berichten/${item._id}`)">
                            <div class="flex items-center justify-between gap-2 ">
                                <h2 class="text-xs dark:text-white font-bold truncate md:text-sm">{{ item.email }}</h2>
                                <p class="text-[0.65em] dark:text-white md:text-sm opacity-70 ">{{ useTimeAgo(item.created_at).value }}</p>
                            </div>
                            <p class="mt-2 md:mt-0 xl:mt-1 dark:text-white mr-11 xl:mr-32 text-xs line-clamp-2 opacity-80 ">{{ item.message }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>


useSeoMeta({
    title: 'Admin - Home',
    description: 'Welkom op mijn portfolio website!',
    ogTitle: 'Portfolio',
    ogDescription: 'Welkom op mijn portfolio website!',
    ogImage: '/icons/test.png',
    ogUrl: '/',
    twitterTitle: 'Portfolio',
    twitterDescription: 'Welkom op mijn portfolio website!',
    twitterImage: '/icons/test.png',
    twitterCard: 'summary'
})

useHead({
    htmlAttrs: { lang: 'nl' },
    link: [{ rel: 'icon', type: 'image/png' }]
})

definePageMeta({
    middleware: ['authorized'],
})


const { $pwa, $PusherOnStart, $PusherOnEvent , $csrfFetch } = useNuxtApp()
const MonthlyVisted = ref(25)
const MonthlyMessages = ref(5)
const currentPage = useLocalStorage('AdminRepoPage', 1)
const currentPageBerichten = useLocalStorage('BerichtenPage', 1)

const Repos = ref([])
const Messages = ref([])
const Installed = ref(false)
const ReactiveEvent = ref()

const { data: Analytics } = await useFetch('/api/analytics')
const { data: Repositories } = await useFetch('/api/repo')
const { data: messages } = await useFetch('/api/berichten')

Repos.value = Repositories.value.Response
Repos.value = Repositories.value.Response
Messages.value = messages.value.Response

MonthlyVisted.value = Analytics.value.result.MonthlyVisted
MonthlyMessages.value = messages.value.Response.length

const Logout = async () => {
    await $csrfFetch('/api/users', { method: 'DELETE' }); return navigateTo("/")
}

onMounted(() => {
    if ($pwa.isInstalled) {
        Installed.value = true
        setTimeout(() => {
            location.replace(`#Repo:${Repos.value.length - 1}`)
        }, 1000);
    }
    $PusherOnStart()
    $PusherOnEvent('client-eventNotification', ReactiveEvent)
    
})

watch(ReactiveEvent, async () => {
    const { data: messages } = await useFetch('/api/berichten')
    Messages.value = messages.value.Response
})



</script>

