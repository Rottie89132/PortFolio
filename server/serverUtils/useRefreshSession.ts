
export default async (event: any, { Session, Refresh }: { Session: string, Refresh: string }) => {

    const newSessionId = crypto.randomUUID()
    const newRefreshId = crypto.randomUUID()

    const User: any = await useStorage("Refresh").getItem(Refresh)

    if (!User) return {
        data: null, error: {
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been authorized because it lacks valid authentication credentials."
        }
    }

    if (Session) await useStorage("Sessions").removeItem(Session)
    await useStorage("Refresh").removeItem(Refresh)

    await useStorage("Sessions").setItem(newSessionId, User)
    await useStorage("Refresh").setItem(newRefreshId, User)

    setTimeout(async () => {
        await useStorage("Sessions").removeItem(newSessionId)
    }, 4 * 60 * 60 * 1000);

    setTimeout(async () => {
        await useStorage("Refresh").removeItem(newRefreshId)
    }, 7 * 24 * 60 * 60 * 1000);

    setCookie(event, "access-token", newSessionId, {
        httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 24 * 60 * 60 * 1000
    });

    setCookie(event, "refresh-token", newRefreshId, {
        httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return {
        data: { ...User, Admin: undefined },
        error: null
    }

}