export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const RefreshId: any = getCookie(event, "refresh-token")
    let user: any = await useStorage("Refresh").getItem(RefreshId)

    const { data, error } = await useRefreshSession(event, {
        Session: SessionId, Refresh: RefreshId
    })

    if (error) return {
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        message: error.message,
    }

    user = data

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        user: { ...user, Admin: undefined },
        authorized: user.Admin ? true : false
    }
})
