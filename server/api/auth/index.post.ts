import consola from "consola";
import crypto from "crypto";
export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {

            const response: Record<string, any> = await useAuth(event);
            if (response.statusCode != 200) return reject(response);
            if (!response.user.is2FAEnabled) useUserStorage(event, response)
            
            else {
                const SessionId = crypto.randomUUID()
                const hash = crypto.createHash('sha1').update(SessionId).digest('hex');
                await useStorage("OptRequired").setItem(SessionId, response.user)

                setTimeout(async () => {
                    if (await useStorage("OptRequired").getItem(SessionId)) {
                        await useStorage("OptRequired").removeItem(SessionId)
                        consola.info("2FA Token expired", hash)
                    }
                }, 5.5 * 60 * 1000);
            
                consola.info("2FA Token created", hash)
                setCookie(event, "OptRequired", SessionId, {
                    httpOnly: true, secure: process.env.production === 'true', sameSite: true, maxAge: 300
                });
            }

            return resolve(response)
        }, 500);
    });
});

