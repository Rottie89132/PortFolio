import consola from "consola"
import crypto from "crypto"
export default async (event: any, data: any) => {
    const SessionId = crypto.randomUUID()
    const refreshId = crypto.randomUUID()

    await useStorage("Sessions").setItem(SessionId, data.user)
    await useStorage("Refresh").setItem(refreshId, data.user)

    const hash = crypto.createHash('sha1').update(SessionId).digest('hex');
    consola.success("Auth session created", hash)

    setTimeout(async () => {
        await useStorage("Sessions").removeItem(SessionId)
        consola.info("Auth session expired", hash)
    }, 4 * 60 * 60 * 1000);

    setTimeout(async () => {
        await useStorage("Refresh").removeItem(refreshId)
    }, 7 * 24 * 60 * 60 * 1000);

    setCookie(event, "access-token", SessionId, {
        httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 4 * 60 * 60 * 1000
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

