<template>
    <Landscape />
    <div class="fixed w-full h-full p-4 pb-5 select-none md:pb-0 md:p-0 ">
        <div :class="!Installed ? 'h-full' : 'h-[95%]'" class="flex items-center justify-center w-full md:h-full p-5 md:rounded-none rounded-3xl bg-gradient-to-r from-teal-50 to-yellow-50 dark:from-[#131313] dark:to-[#22221E]">
            <div class="">
                <h1 class="text-[8em] md:text-[13em] dark:text-white font-black leading-[1em] mb-2">{{ status }}</h1>
                <p v-if="status == 404" class="font-bold  dark:text-white md:text-[2em] text-[2em] opacity-60 leading-[1em]">De aangevraagde pagina is niet gevonden</p>
                <p v-else class="font-bold md:text-[2em]  dark:text-white text-[1.8em] opacity-60 leading-[1em]">{{ statusMessage }}</p>
                <p class="mt-2 dark:text-white">{{ message }}</p>
                <div class="flex items-center gap-4 -mt-2">
                    <button @click="handleError" class="px-5 py-2 mt-10 text-sm font-semibold dark:text-black dark:bg-white dark:ring-white text-white bg-black ring-2 ring-black rounded-xl">{{ textLabel }}</button>
                    <button @click="useRouter().back" class="flex items-center gap-2 px-4 py-2 mt-10 text-sm font-semibold dark:text-black dark:bg-white dark:ring-white text-white bg-black opacity-90 ring-2 ring-black rounded-xl">
                        <Icon name="solar:rewind-back-bold-duotone" size="1.4em"></Icon>
                        Vorige pagina
                    </button>
                </div>
            </div> 
        </div>
    </div>
</template>

<script setup>
const { $pwa } = useNuxtApp()
const Error = useError();
const status = ref(Error.value.statusCode)
const message = ref(Error.value.message)
const statusMessage = ref(Error.value.statusMessage)
const textLabel = ref("Home")
const Installed = ref(false)

const { data } = await useFetch('/api/users')

if (data.value?.statusCode == 200 && data.value.authorized) {
    textLabel.value = "Dashboard"
}

if (data.value?.statusCode == 200 && !data.value.authorized) {
    textLabel.value = "Profiel"
}

const handleError = () => {
    if(data.value?.statusCode == 200 && data.value.authorized) return clearError({redirect: '/dashboard',});
    if(data.value?.statusCode == 200 && !data.value.authorized) return clearError({redirect: '/profile',});
    return clearError({redirect: '/', });
};

onMounted(() => {
    if ($pwa.isInstalled) {
        Installed.value = true
    }
})
</script>