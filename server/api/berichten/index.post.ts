import PusherServer from "pusher"

const config = useRuntimeConfig()
const PushServer = new PusherServer({
    appId: config.PusherAppID,
    key: config.public.PusherAppKey,
    secret: config.PusherAppSecret,
    cluster: config.public.cluster,
    useTLS: true
});

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {

            const request = await readBody(event)

            if (!request) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })

            const { naam: name, email, bericht: message, telefoon: phone } = request
            if (!name || !email || !message) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax."
            })

            await Berichten.create({ name, email, message, phone }).then(async (bericht) => {
                PushServer.trigger(config.public.PusherChannel, "client-eventNotification", { actionID: crypto.randomUUID() });
                
                await useRenderEmail({ type: 0, name, email: config.emailToMe, message, phone, id: bericht.id }).catch(() => {
                    return reject({
                        statusCode: 500,
                        statusMessage: "Internal Server Error",
                        message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
                    })
                })

                await useRenderEmail({ type: 1, name, email, message, phone, id: bericht.id }).catch(() => {
                    return reject({
                        statusCode: 500,
                        statusMessage: "Internal Server Error",
                        message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
                    })
                })

                return resolve({
                    statusCode: 200,
                    statusMessage: "OK",
                    message: "The request has succeeded.",
                })
            }).
            
            catch((error) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
                })
            })
        }, 500);
    });
});
