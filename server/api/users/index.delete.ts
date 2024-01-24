export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        
        const SessionId: any = getCookie(event, "token")
        const user = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The requested resource could not be found."
        })

        await useStorage("Sessions").removeItem(SessionId)
        deleteCookie(event, "token")

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })

    });
    
})
