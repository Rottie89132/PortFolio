export default defineNuxtRouteMiddleware(async (to, from) => {
    
    const { data } = await useFetch('/api/users')
    if(data.value?.statusCode !== 200) {
        await $fetch("/api/auth/refresh")
    }
    
})
