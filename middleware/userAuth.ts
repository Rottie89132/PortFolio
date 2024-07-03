export default defineNuxtRouteMiddleware(async (to, from) => {

    const store = useSessionsStore()
    const data: Record<string, any> = ref(await store.getSession())

    if (data.value.statusCode != 200) {
        throw createError({
            statusCode: 401,
            message: data.value.message,
            statusMessage: "Je hebt geen toegang tot de aangevraagde pagina",
            fatal: true,
        })
    }
    
})
