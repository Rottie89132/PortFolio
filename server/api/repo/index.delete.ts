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
    return new Promise(async (resolve, reject) => {
        
        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
    
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })
        
        
        if (!user.Admin) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "The server understood the request but refuses to authorize it."
        })

        PushServer.trigger(config.public.PusherChannel, "client-eventRepositories", { actionID: crypto.randomUUID() });
        const repo = await readBody(event)
        await Repositories.findOneAndDelete({ repo_id: repo.data })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })
    })
})
