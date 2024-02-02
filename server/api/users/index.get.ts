export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "token")
    const user: any = await useStorage("Sessions").getItem(SessionId)

    const OptId: any = getCookie(event, "OptRequired")
    const OptEnabled: any = await useStorage("OptRequired").getItem(OptId)
    
    if (OptEnabled?.is2FAEnabled) return {
        statusCode: 428,
        statusMessage: "Precondition Required",
        message: "the request requires an authentication with an OTP token."
    } 

    if (!user ) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been authorized because it lacks valid authentication credentials."
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        user: { ...user, Admin: undefined },
        authorized: user.Admin
    }

})
