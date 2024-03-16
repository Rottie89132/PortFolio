export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {

        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
        let berichten: any = null

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })
        
        if (!user.Admin) berichten = await Berichten.find({ email: user.Email }).sort({ created_at: -1 })
        else berichten = await Berichten.find().sort({ created_at: -1 }).limit(3)
        
        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            Response: berichten
        })
    })
})
