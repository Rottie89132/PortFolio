export default defineEventHandler(async (event) => {
    
    const SessionId: any = getCookie(event, "token")
    const user: any = await useStorage("Sessions").getItem(SessionId)
    const PostId = getRouterParams(event).id
    let markRead: any = ''

    if (PostId.length != 24) return {
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "The server cannot or will not process the request due to an apparent client error."
    }

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been authorized because it lacks valid authentication credentials."
    }

    if (!user.Admin) return {
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "The server understood the request but refuses to authorize it."
    }

    const bericht: any = await Berichten.findById(PostId)

    if (!bericht) return {
        statusCode: 404,
        statusMessage: "Not Found",
        message: "The requested resource could not be found but may be available in the future."
    }

    if(bericht.read){
        markRead = await Berichten.findOneAndUpdate({ _id: PostId }, { read: false })
    } else {
        markRead = await Berichten.findOneAndUpdate({ _id: PostId }, { read: true })
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        Response: !markRead.read
    }

});