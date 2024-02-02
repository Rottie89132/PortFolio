export default defineEventHandler( async (event) => {
    return {ip: await useIP(event)}
})
