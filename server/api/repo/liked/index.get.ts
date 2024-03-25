export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })

        const Item: any = await Repositories.find({ liked_byId: user?.Id })

        if (!Item) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The server has not found anything matching the Request-URI."
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            data: Item
        })

    })
})