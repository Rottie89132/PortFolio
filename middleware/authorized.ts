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

    if (!data.value.authorized) {
        
        throw createError({
            statusCode: 403,
            message: "The server understood the request but refuses to authorize it.",
            statusMessage: "Je hebt niet de juiste rechten om deze pagina te bezoeken",
            fatal: true,
        })
    }
})

