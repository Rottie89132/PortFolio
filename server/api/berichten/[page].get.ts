export default defineEventHandler(async (event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "token")
        const user: any = await useStorage("Sessions").getItem(SessionId)
        const currentPage = Number(getRouterParams(event).page) - 1 || 0

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

        const berichten = await Berichten.find().sort({ created_at: -1 })
        const result = [];

        for (let i = 0; i < berichten.length; i += 5) { result.push(berichten.slice(i, i + 5)) }
        const data = result[currentPage]


        if (!data) {
            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found."
            })
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            page: currentPage + 1,
            total: result.length,
            Response: data
        })
    });
})