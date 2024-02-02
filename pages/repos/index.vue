<template>
    <VitePwaManifest />
    <div class="fixed w-full select-none  h-full p-4 pb-5 md:pb-0 md:p-0 ">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'"
            class="w-full md:h-full p-5 md:rounded-none pb-4 rounded-3xl md:pl-52 bg-[#f0f0f0] md:bg-white dark:bg-[#131313] dark:md:bg-neutral-900 overflow-auto">
            <div class="grid gap-24 ">
                <div class="flex items-center justify-between ">
                    <NavLinksAdmin v-if="data?.statusCode == 200 && data.authorized" />
                    <NavLinksUser v-else-if="data?.statusCode == 200 && !data.authorized" />
                    <NavLinks v-else />
                    <div class=" flex gap-4 items-center">
                        <ClientOnly>
                            <ColorMode />
                            <Online />
                            <button v-if="data?.statusCode == 200" @click="Logout" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">Uitloggen</button>
                            <button v-else @click="HandleModule('Inloggen')" class="px-6 py-1 dark:text-neutral-800 font-semibold dark:bg-white dark:hover:bg-white dark:hover:ring-white dark:ring-white text-white rounded-lg bg-neutral-800 hover:bg-neutral-900 ring-2 ring-neutral-800 hover:ring-neutral-900">{{ textLabel }}</button>
                        </ClientOnly>
                    </div>
                </div>
            </div>
            <div class=" w-full h-fit mt-6 md:my-10 xl:mt-20 md:w-[89.2%]  ">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h1 class="text-[1.5em] text-black dark:text-white font-extrabold ">Repositories</h1>
                    <div v-if="items.length > 0 && hidebuttons.total > 1" class="flex items-center gap-2 ">
                        <button aria-label="Vorige" v-if="hidebuttons.page > 1" :disabled="loading"
                            class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl"
                            @click="PreviousPage">
                            <Icon name="material-symbols:keyboard-arrow-left" size="1.2em"></Icon>
                        </button>
                        <button aria-label="Volgende" v-else :disabled="loading"
                            class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl"
                            @click="NextPage">
                            <Icon name="material-symbols:keyboard-arrow-right" size="1.2em"></Icon>
                        </button>
                        <button aria-label="Volgende" v-if="hidebuttons.page > 1" :disabled="loading"
                            class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl"
                            @click="NextPage">
                            <Icon
                                :name="hidebuttons.page >= hidebuttons.total ? 'material-symbols:keyboard-double-arrow-left' : 'material-symbols:keyboard-arrow-right'"
                                size="1.2em"></Icon>
                        </button>
                        <button aria-label="Vorige" v-else :disabled="loading"
                            class="p-2 bg-[#F7F7F7] dark:bg-[#111111] dark:text-white flex items-center justify-center rounded-xl"
                            @click="PreviousPage">
                            <Icon
                                :name="hidebuttons.page <= 1 ? 'material-symbols:keyboard-double-arrow-right' : 'material-symbols:keyboard-arrow-left'"
                                size="1.2em"></Icon>
                        </button>

                        <form @submit.prevent="navigateToPage">
                            <input v-model="currentPage" name="page" type="number" aria-label="Search" class="p-[0.34rem] ring-2 ring-[#e8e8e8] dark:ring-[#1a1a1a] dark:bg-[#111111] dark:text-white appearance-none w-9 text-center font-medium bg-[#F7F7F7] flex items-center justify-center rounded-xl">
                        </form>
                    </div>
                </div>
                <div class="flex items-center gap-2 dark:text-white " v-if=" loadingIndicater">
                    <icon name="mingcute:loading-fill" class=" animate-spin" size="1.4em"></icon>Repositories worden
                    ingeladen
                </div>
                <div v-else-if="items.length < 1">
                    <p class="opacity-75 dark:text-white ">Helaas zijn er nog geen repositories beschikbaar. Kom later nog
                        eens terug.</p>
                </div>
                <div v-else class=" p-3 bg-[#F7F7F7] dark:bg-[#111111] h-fit rounded-2xl transition-transform ">
                    <div class="w-full h-full overflow-y-auto snap-y snap-proximity rounded-xl scroll-smooth">
                        <div v-for="(item, index) in items" :key="item.full_name" class="mb-3 delay-100 last:mb-0 animate-fade-in">
                            <div v-if="item.loaded"
                                class="p-3 bg-white dark:bg-neutral-900 md:snap-end snap-center h-fit rounded-xl">
                                <div class="flex items-center gap-2 ">
                                    <NuxtImg draggable="false" :alt="item.owner.avatar_url" :src="item.owner.avatar_url" class="w-5 rounded-full">
                                    </NuxtImg>
                                    <h2 class="font-semibold dark:text-white ">{{ item.full_name }}</h2>
                                </div>
                                <p class="mt-2 mr-5 text-balance text-sm whitespace-pre-wrap break-words opacity-70 md:line-clamp-2 line-clamp-3 dark:text-white ">{{ item.description || defaultDescription }}</p>
                                <div class="flex  items-center gap-3 mt-2 overflow-scroll font-bold ">
                                    <div v-if="item.topics.length >= 1" v-for="topics in item.topics">
                                        <p class="dark:text-white text-sm text-[0.83em]">{{ topics }}</p>
                                    </div>
                                    <div v-else>
                                        <p class="dark:text-white">{{ noTags }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 justify-between font-semibold select-none">
                                    <div class="flex items-center gap-3 ">
                                        <a v-if="item.homepage" :href="item.homepage" target="_blank"
                                            class="flex items-center justify-center px-3 py-1 mt-3 mb-1 text-xs dark:text-black dark:bg-white font-semibold dark:ring-white text-white bg-black rounded ring-2 ring-black">Bezoeken</a>
                                        <a v-if="item.visibility == 'public'" :href="item.html_url" target="_blank"
                                            class="flex items-center justify-center gap-1 px-[0.6rem] py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 dark:bg-neutral-800 dark:ring-neutral-800 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200">
                                            <Icon name="tabler:brand-github-filled" size="1.2em"></Icon>GitHub
                                        </a>
                                        <div v-else class="relative group">
                                            <a class="flex items-center justify-center gap-1 px-[0.6rem] dark:bg-neutral-800 dark:ring-neutral-800 py-1 mt-3 mb-1 text-xs rounded dark:text-neutral-300 text-neutral-600 bg-neutral-200 ring-2 ring-neutral-200 cursor-not-allowed">
                                            <Icon name="tabler:brand-github-filled" size="1.2em"></Icon>GitHub
                                            </a>
                                            <div class=" absolute -ml-[0.15em] text-center w-36 -top-[0.12em]  transform -translate-y-full dark:bg-indigo-500 bg-indigo-600 text-white text-xs rounded-md py-1 px-2 hidden group-hover:block transition duration-200 ease-in-out">
                                                <p class="text-center p-[0.45em] z-20 dark:bg-indigo-500 bg-indigo-600">
                                                    <span class="font-semibold">Dit project is privé!</span>
                                                </p>
                                                <div class=" absolute w-3 h-3 dark:bg-indigo-500 bg-indigo-600 transform rotate-45 -bottom-[0.44em] left-5 -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <liked :url="item.html_url" :visibility="item.visibility" :name="item.name" :id="item.repo_id" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModalBase v-model:texthead="title" v-model:textbase="subtitle" v-model:status="OpenModule"
        v-model:DelayStatus="OpenModuleDelay" v-model:textLabel="buttonLabel" v-model:AuthModule="AuthModule" v-model:type="datatype">
        <div v-if="AuthModule">
            <FieldInput :name="'email'" :type="'email'" :label="'Gebuikersnaam'" />
            <FieldInput :name="'wachtwoord'" :type="'password'" :label="'Wachtwoord'" />
        </div>
    </ModalBase>
</template>

<script setup>

const { $pwa, $StartSocket, $Socket, $csrfFetch  } = useNuxtApp()
const items = ref([]);
const currentPage = ref()
const router = useRouter();
const OpenModule = ref(false)
const OpenModuleDelay = ref(false)
const AuthModule = ref(true)
const title = ref("")
const subtitle = ref("")
const buttonLabel = ref("")
const textLabel = ref("Inloggen")
const Repos = ref([])
const hidebuttons = ref([])
const loading = ref(false)
const Installed = ref(false)
const ReactiveEvent = ref(false);
const loadingIndicater = ref(true)
const datatype = ref('')

useSeoMeta({
    title: `PortFolio - Repositories`,
    description: 'Hier vind je een overzicht van al mijn repositories!',
    ogTitle: 'PortFolio',
    ogDescription: 'Hier vind je een overzicht van al mijn repositories!',
    ogImage: '/icons/test.png',
    ogUrl: '/',
    twitterTitle: 'PortFolio',
    twitterDescription: 'Hier vind je een overzicht van al mijn repositories!',
    twitterImage: '/icons/test.png',
    twitterCard: 'summary'
})

useHead({
    htmlAttrs: { lang: 'nl' },
    link: [{ rel: 'icon', type: 'image/png', }]
})

onMounted(async () => {
    if ($pwa.isInstalled) Installed.value = true
    $StartSocket()
    $Socket('eventRepositories', ReactiveEvent)
})

const noTags = "Momenteel niet beschikbaar"
const defaultDescription = "Op dit moment is er helaas geen specifieke beschrijving beschikbaar voor dit project."
currentPage.value = useRoute().query.Page

const { data } = await useFetch('/api/users')

const Logout = async () => {
    await $csrfFetch('/api/users', { method: 'DELETE' }); return navigateTo("/")
}

const navigateToPage = async () => {

    if (currentPage.value > hidebuttons.value.total) currentPage.value = hidebuttons.value.total
    else if (currentPage.value < 1) currentPage.value = 1
    useLocalStorage('RepoPage').value = currentPage.value

    router.push({ path: '/Repos', query: { Page: currentPage.value } })

    const { data: Repositories } = await useCsrfFetch(`/api/repo/${currentPage.value}`, {
        method: "POST", body: useLocalStorage('SavedLikes', []).value.filter(e => e.liked == true)
    })
    loadedRepos(Repositories)
}

const PreviousPage = async () => {
    const page = useLocalStorage('RepoPage')

    if (page.value == 1) page.value = hidebuttons.value.total
    else page.value = Number(page.value) - 1

    router.push({ path: '/Repos', query: { Page: page.value } })
    currentPage.value = page.value

    const { data: Repositories } = await useCsrfFetch(`/api/repo/${page.value}`, {
        method: "POST", body: useLocalStorage('SavedLikes', []).value.filter(e => e.liked == true)
    })
    loadedRepos(Repositories)

}

const NextPage = async () => {
    const page = useLocalStorage('RepoPage')

    if (page.value >= hidebuttons.value.total) page.value = 1
    else page.value = Number(page.value) + 1

    router.push({ path: '/Repos', query: { Page: page.value } })
    currentPage.value = page.value

    const { data: Repositories } = await useCsrfFetch(`/api/repo/${page.value}`, {
        method: "POST", body: useLocalStorage('SavedLikes', []).value.filter(e => e.liked == true)
    })
    loadedRepos(Repositories)

}

const HandleModule = (type) => {

    if (data.value?.statusCode == 200 && type == "Inloggen" && data.value?.authorized) return navigateTo("/dashboard")
    if (data.value?.statusCode == 200 && type == "Inloggen" && !data.value?.authorized) return navigateTo("/profile")
    datatype.value = type
    
    AuthModule.value = type != 'Contact'
    title.value = type
    buttonLabel.value = 'Login'
    subtitle.value = 'Vul hieronder je gebruikersnaam en wachtwoord in om toegang te krijgen tot je account.'

    OpenModule.value = true
    setTimeout(() => { OpenModuleDelay.value = true }, 100)
}

const animateIn = () => {
    loading.value = true
    setTimeout(() => {
        items.value.forEach((item, index) => {
            setTimeout(() => {
                item.loaded = true;
            }, index * 200);
        });
    }, 250);

    setTimeout(() => {
        loading.value = false
    }, 500);
}

const loadedRepos = async (Repositories) => {
    items.value = []
    Repos.value = Repositories.value?.Response
    hidebuttons.value = Repositories.value

    const savedRepos = useLocalStorage('SavedLikes', [])
    savedRepos.value.filter(e => e.liked == true)

    if (Repos.value) {
        currentPage.value = Repositories.value.page
        useLocalStorage('RepoPage').value = Repositories.value.page

        Repos.value.forEach(item => {
            const saved = savedRepos.value.find(e => e.id == item.repo_id) || { liked: false }
            if (!saved.liked) items.value.push({ ...item, loaded: false })
            else items.value.unshift({ ...item, loaded: false })
        });
    }

    else {
        currentPage.value = 1
        useLocalStorage('RepoPage').value = 1
        const { data: Repositories } = await useCsrfFetch(`/api/repo/${currentPage.value}`)
        router.push({ path: '/Repos', query: { Page: currentPage.value } })

        Repos.value = Repositories.value?.Response
        hidebuttons.value = Repositories.value

        if (Repos.value) {
            currentPage.value = Repositories.value.page
            useLocalStorage('RepoPage').value = Repositories.value.page
            Repos.value.forEach(item => {
                const saved = savedRepos.value.find(e => e.id == item.repo_id) || { liked: false }
                if (!saved.liked) items.value.push({ ...item, loaded: false })
                else items.value.unshift({ ...item, loaded: false })
            });
        }

    }

    animateIn()
}


watch(ReactiveEvent, async () => {
    const { data: Repositories } = await useCsrfFetch(`/api/repo/${useRoute().query.Page}`, {
        method: "POST", body: useLocalStorage('SavedLikes', []).value.filter(e => e.liked == true)
    })

    loadedRepos(Repositories)

})


if(process.client){
    setTimeout(async () => {
        const { data: Repositories } = await useCsrfFetch(`/api/repo/${currentPage.value}`, {
            method: "POST", body: useLocalStorage('SavedLikes', []).value.filter(e => e.liked == true)
        })

        hidebuttons.value = Repositories.value
        loadedRepos(Repositories)
        loadingIndicater.value = false
    }, 100);
} 


    


</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}


::-webkit-scrollbar {
    @apply hidden;
}

.tooltip::after {
    @apply absolute top-full left-10 border-[5px];
    content: "";
    margin-left: -5px;
    border-style: solid;
    border-color: #3182ce transparent transparent transparent;
}



</style>
