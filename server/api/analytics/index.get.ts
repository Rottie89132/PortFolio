export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
    const NowMonth: number = new Date().getMonth() + 1

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }
    
    if (!user.Admin) return {
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "The server understood the request but refuses to authorize it."
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        result: await analytics.findOne({ CurrentMonth: NowMonth })
    }

});
