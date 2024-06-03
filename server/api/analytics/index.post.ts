import PusherServer from "pusher"

const config = useRuntimeConfig()
const PushServer = new PusherServer({
    appId: config.PusherAppID,
    key: config.public.PusherAppKey,
    secret: config.PusherAppSecret,
    cluster: config.public.cluster,
    useTLS: true
});


export default defineEventHandler(async (event) => {
    const now: Date = new Date();
    const NowMonth: number = now.getMonth() + 1;
    const NowYear: number = now.getFullYear();
    const Analytics: Record<string, any> | null = await analytics.findOne({ CurrentMonth: NowMonth, CurrentYear: NowYear });

    if (!Analytics) await analytics.create({ CurrentMonth: NowMonth, MonthlyVisted: 1, CurrentYear: NowYear });
    else await analytics.findOneAndUpdate({ CurrentMonth: NowMonth, CurrentYear: NowYear }, { $inc: { MonthlyVisted: 1 } });
    
    PushServer.trigger(config.public.PusherChannel, "client-eventVisitNotification", { actionID: crypto.randomUUID() });
    
    return;
});
