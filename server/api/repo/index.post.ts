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
        const SessionId: any = getCookie(event, "token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)
        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been authorized because it lacks valid authentication credentials."
        })

        if (!user.Admin) return reject({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "The server understood the request but refuses to authorize it."
        })

        const repo = await readBody(event)

        const CheckRepo = await Repositories.findOne({ repo_id: repo.data.id })
        if (CheckRepo) return reject({
            statusCode: 304,
            statusMessage: "Not Modified",
            message: "The request has not been modified since the specified time."
        })

        PushServer.trigger(config.public.PusherChannel, "client-eventRepositories", { actionID: crypto.randomUUID() });

        await Repositories.create({
            repo_id: repo.data.id,
            name: repo.data.name,
            full_name: repo.data.full_name,
            description: repo.data.description,
            html_url: repo.data.html_url,
            homepage: repo.data.homepage,
            visibility: repo.data.visibility,
            topics: repo.data.topics,
            owner: {
                name: repo.data.owner.login,
                avatar_url: repo.data.owner.avatar_url,
                html_url: repo.data.owner.html_url
            },
            updated_at: repo.data.updated_at,
            created_at: repo.data.created_at,
        });

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        })
    })
})

