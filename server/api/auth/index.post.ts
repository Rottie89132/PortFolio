export default defineEventHandler( (event) => {
    return new Promise( (resolve, reject) => {
        setTimeout(async () => {

            const response: Record<string, any> = await useAuth(event);
            if (response.statusCode != 200) return reject(response);

            if(!response.user.is2FAEnabled) {
                useUserStorage(event, response)
            }
            
            else {
                const SessionId = crypto.randomUUID()
                await useStorage("OptRequired").setItem(SessionId, response.user)

                setCookie(event, "OptRequired", SessionId, {
                    httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 600
                });
            }

            return resolve(response)
        }, 500);
    });
});

