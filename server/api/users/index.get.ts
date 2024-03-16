export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const RefreshId: any = getCookie(event, "refresh-token")
    let user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

    const OptId: any = getCookie(event, "OptRequired")
    const OptEnabled: any = await useStorage("OptRequired").getItem(OptId)

    if (OptEnabled?.is2FAEnabled) return {
        statusCode: 428,
        statusMessage: "Precondition Required",
        message: "the request requires an authentication with an OTP token."
    }

    if (!user) {
        const { data, error } = await useRefreshSession(event, {
            Session: SessionId, Refresh: RefreshId
        })

        if (error) return {
            statusCode: error.statusCode,
            statusMessage: error.statusMessage,
            message: error.message
        }

        user = data
    }

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        user: { ...user, Admin: undefined },
        authorized: user.Admin
    }
})
