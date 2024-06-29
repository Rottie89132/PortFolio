export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "access-token")
        const refreshId: any = getCookie(event, "refresh-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
        const RefreshExists: Record<string, any> | null = await useStorage("Refresh").getItem(refreshId)

        if (!user && !RefreshExists) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })

        await useStorage("Sessions").removeItem(SessionId)
        await useStorage("Refresh").removeItem(refreshId)

        deleteCookie(event, "access-token")
        deleteCookie(event, "refresh-token")

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })

    });

})
