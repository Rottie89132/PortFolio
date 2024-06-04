export default defineEventHandler((event) => {
    // setTimeout(async () => {
    //     const SessionId: any = getCookie(event, "access-token")
    //     const RefreshId: any = getCookie(event, "refresh-token")
    //     const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

    //     if (!user) await useRefreshSession(event, {
    //         Session: SessionId, Refresh: RefreshId
    //     })
    // }, 500);
})