export default defineNuxtRouteMiddleware(async (to, from) => {
    
    const { data }: Record<string, any> = await useFetch('/api/users')
    if (data.value.statusCode != 200) {
        throw createError({
            statusCode: 401,
            message: data.value.message,
            statusMessage: "Je hebt geen toegang tot de aangevraagde pagina",
            fatal: true,
        })
    }
    
})
