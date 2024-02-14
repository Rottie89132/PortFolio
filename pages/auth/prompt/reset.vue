<template>
    <VitePwaManifest />
    <Landscape />
    <div class="fixed w-full h-full p-4 pb-5 ">
        <div class="w-full h-full p-5 pb-4 ">
            <div class=" w-full h-full md:h-fit p-4 md:p-12 rounded-xl md:mt-10 xl:mt-20 bg-white dark:bg-neutral-900  "></div>
        </div>
    </div>
</template>

<script setup>

const { $pwa, $csrfFetch, $PusherOnStart } = useNuxtApp()
const id = useRoute().query.token

onMounted(async () => {
    $PusherOnStart()

    await $csrfFetch('/api/auth/forgot', { method: 'post', body: { token: id } }).then(() => navigateTo('/profile')).catch(() => {
        throw createError({
            statusCode: 410,
            message: "The requested resource is no longer available",
            statusMessage: "Deze link is niet geldig of is verlopen.",
            fatal: true,
        })
    })
})

</script>