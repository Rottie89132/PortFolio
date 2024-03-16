
export default async (event: any, data: any) => {
    const SessionId = crypto.randomUUID()
    const refreshId = crypto.randomUUID()

    await useStorage("Sessions").setItem(SessionId, data.user)
    await useStorage("Refresh").setItem(refreshId, data.user)

    setTimeout(async () => {
        await useStorage("Sessions").removeItem(SessionId)
    }, 2 * 60 * 60 * 1000);

    setTimeout(async () => {
        await useStorage("Refresh").removeItem(refreshId)
    }, 7 * 24 * 60 * 60 * 1000);

    setCookie(event, "access-token", SessionId, {
        httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 2 * 60 * 60 * 1000
    });

    setCookie(event, "refresh-token", refreshId, {
        httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded."
    }
}

