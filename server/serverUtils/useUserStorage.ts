
export default async (event: any, data: any) => {
    const SessionId = crypto.randomUUID()
    await useStorage("Sessions").setItem(SessionId, data.user)

    setTimeout(async() => { 
        await useStorage("Sessions").removeItem(SessionId) 
    }, 24 * 60 * 60 * 1000 ); 
    
    setCookie(event, "token", SessionId, {
        httpOnly: true, secure: false, sameSite: true, maxAge: 24 * 60 * 60 * 1000
    });

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded."
    }
}

