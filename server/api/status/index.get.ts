export default defineEventHandler( async (event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            return resolve({"status":200,"message":"OK"})
        }, 200)
    })
})
