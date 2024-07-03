export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()
    const { data } = await useFetch('/api/users')
    if (data.value?.statusCode !== 200) store.setSession(await $fetch("/api/auth/refresh"))
    else store.setSession(data.value)

})
