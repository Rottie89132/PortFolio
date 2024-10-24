export default defineEventHandler(async (event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {

            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
            const id = getRouterParams(event).id

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

        
            await Information.findByIdAndDelete(id).catch((err) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "The server has encountered a situation it doesn't know how to handle."
                })
            });

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })

        }, 2000);
    })

})
