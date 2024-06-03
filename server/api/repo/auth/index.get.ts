
export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        
        const currentPage = Number(getQuery(event).page) - 1 || 0
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

        const GitConnection: Record<string, any> | null = await GitUser.findOne({ UserID: user.Id })
        console.log(GitConnection)
        if (!GitConnection) return reject({
            statusCode: 404,
            statusMessage: "Not Found",
            message: "The requested resource could not be found."
        })

        const token = useEncryptValue(GitConnection.AccessToken)
        return await useGetRepositories(token, currentPage, resolve).catch(async (error: any) => {
            const OctoKitData = await useOctokit(GitConnection.installationId)
            await useSaveInstall("Update", user, OctoKitData)
            return await useGetRepositories(OctoKitData.token, currentPage, resolve).catch((error: any) => {
                return reject({
                    statusCode: 404,
                    statusMessage: "Not Found",
                    message: "The github connection is not valid."
                })
            })
        })
    })
})
