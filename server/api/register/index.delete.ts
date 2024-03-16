export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const RefreshId: any = getCookie(event, "refresh-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            await User.deleteOne({ _id: user.Id });
            await useStorage("Sessions").removeItem(SessionId);
            await useStorage("Refresh").removeItem(RefreshId);
            deleteCookie(event, "access-token");
            deleteCookie(event, "refresh-token");

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            })
        }, 500)
    });
})
