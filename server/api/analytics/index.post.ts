
export default defineEventHandler(async (event) => {
    const NowMonth: number = new Date().getMonth() + 1
    const Analytics: Record<string, any> | null = await analytics.findOne({ CurrentMonth: NowMonth })
    
    if (!Analytics) await analytics.create({ CurrentMonth: NowMonth, MonthlyVisted: 1 })
    else await analytics.findOneAndUpdate({ CurrentMonth: NowMonth }, { 
        $set: { MonthlyVisted: Analytics.MonthlyVisted += 1 }
    }); return 
});
