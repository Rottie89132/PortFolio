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


    if (!data.value.authorized)  {
        throw createError({
            statusCode: 403,
            message: "The server understood the request but refuses to authorize it.",
            statusMessage: "Je hebt niet de juiste rechten om deze pagina te bezoeken",
            fatal: true,
        })
    }
    
    
    
})


//if(to.path == from.path) return navigateTo('/')
//return navigateTo(from.path)