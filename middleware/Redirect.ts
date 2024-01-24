export default defineNuxtRouteMiddleware(async (to, from) => {

    const { data }: Record<string, any> = await useFetch('/api/users')
    if (data.value.statusCode !== 200) return navigateTo('/portfolio')
    if (data.value.statusCode == 200 && data.value.authorized) return navigateTo('/dashboard')
    if (data.value.statusCode == 200 && !data.value.authorized) return navigateTo('/profile')

})
