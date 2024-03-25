export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })

        const id = getRouterParams(event).id
        const Item = await Repositories.findOne({ repo_id: id })

        if (!Item) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The server has not found anything matching the Request-URI."
        })

        const saveLike = await Repositories.findOneAndUpdate({ repo_id: id }, {
            $push: { liked_byId: user.Id }
        })

        if (!saveLike) return reject({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "You have successfully liked this repository.",
        })

    })
})