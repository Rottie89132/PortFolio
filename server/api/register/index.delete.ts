export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "token")
            const user: any = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found."
            })

            await User.deleteOne({ _id: user.Id })
            await useStorage("Sessions").removeItem(SessionId)
            deleteCookie(event, "token")

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })
        }, 500)
    });
})
