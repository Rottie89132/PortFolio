import { useScheduler } from "#scheduler"

const { FetchServer }:any = useRuntimeConfig()
export default defineNitroPlugin(() => {
    const scheduler = useScheduler();
    scheduler.run(() => {
        setTimeout(async () => await fetch(FetchServer).catch(err => console.error(err)))
    }).everyMinutes(5)
})



