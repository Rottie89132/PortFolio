export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "token")
        const user: any = await useStorage("Sessions").getItem(SessionId)
        const currentPage = Number(getRouterParams(event).page) - 1 || 0
        const result = [];
        let berichten: any = null

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been authorized because it lacks valid authentication credentials."
        })

        if (!user.Admin) berichten = await Berichten.find({ email: user.Email }).sort({ read: -1, created_at: -1 })
        else berichten = await Berichten.find().sort({ read: 1, created_at: -1 })

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