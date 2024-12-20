export default defineEventHandler(async (event) => {
    return new Promise( async(resolve, reject) => {
        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
    
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })

        if (!user.Admin) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "The server understood the request but refuses to authorize it."
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            result: (await analytics.find().sort({CurrentYear: -1, CurrentMonth: -1}).limit(6)).reverse()
        })
    })
});
