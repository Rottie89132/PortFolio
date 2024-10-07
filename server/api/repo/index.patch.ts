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

        const repo = await readBody(event)
        const checkIfRepoExists: Record<string, any> | null = await Repositories.findOne({ repo_id: repo.data })
        if (!checkIfRepoExists) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The requested resource could not be found."
        })

        
        PushServer.trigger(config.public.PusherChannel, "client-eventRepositories", { actionID: crypto.randomUUID() });

        await Repositories.updateOne({ repo_id: repo.data }, {
            $set: {
                repo_id: checkIfRepoExists.repo_id,
                name: checkIfRepoExists.name,
                full_name: checkIfRepoExists.full_name,
                description: checkIfRepoExists.description,
                html_url: checkIfRepoExists.html_url,
                homepage: checkIfRepoExists.homepage,
                visibility: checkIfRepoExists.visibility,
                topics: checkIfRepoExists.topics,
                owner: {
                    name: checkIfRepoExists.owner.login,
                    avatar_url: checkIfRepoExists.owner.avatar_url,
                    html_url: checkIfRepoExists.owner.html_url
                },
                updated_at: checkIfRepoExists.updated_at,
                created_at: checkIfRepoExists.created_at,
            }
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })
    })
})

