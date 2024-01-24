export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {
    
            const SessionId: any = getCookie(event, "token")
            const user: any = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been authorized because it lacks valid authentication credentials."
            })

            if (!user.Admin) return reject({
                statusCode: 403,
                statusMessage: "Forbidden",
                message: "The server understood the request but refuses to authorize it."
            })

            const berichten = await Berichten.find().sort({ created_at: -1 }).limit(3)

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
                Response: berichten
            })
    })
})
