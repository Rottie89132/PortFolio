export default defineNuxtRouteMiddleware(async (to, from) => {
    const { data }: Record<string, any> = await useFetch('/api/users')
    if(data.value.statusCode != 428) return navigateTo("/")
})
