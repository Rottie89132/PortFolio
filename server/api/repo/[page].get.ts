export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const currentPage = Number(getRouterParams(event).page) - 1 || 0
        const Item = (await Repositories.find()).reverse()
        const result = [];

        for (let i = 0; i < Item.length; i += 3) { result.push(Item.slice(i, i + 3)) }
        const data = result[currentPage]

        if (!data) {
            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found."
            })
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            page: currentPage + 1,
            total: result.length,
            Response: data
        })
    })
})