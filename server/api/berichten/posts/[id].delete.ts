export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "access-token")
        const PostId = getRouterParams(event).id
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (PostId.length != 24) return reject({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "The server cannot or will not process the request due to an apparent client error."
        })

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })
        
        if (!user.Admin) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "The server understood the request, but is refusing to authorize it."
        })

        const bericht = await Berichten.findByIdAndDelete(PostId)
        if (!bericht) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The requested resource could not be found but may be available in the future."
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            Response: bericht
        })
    });
})