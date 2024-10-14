export default defineEventHandler(async (event) => {

    const items = await Information.find({})
    
    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        data: items
    }
})



