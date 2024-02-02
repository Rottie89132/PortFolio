export default defineEventHandler( async (event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            return resolve({ statusCode: 200, statusMessage: "OK",})
        }, 200)
    })
})
