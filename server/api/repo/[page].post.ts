export default defineEventHandler(async(event) => {
    return new Promise(async (resolve, reject) => {
        const SavedRepo = await readBody(event)
        const currentPage = Number(getRouterParams(event).page) - 1 || 0
        const Item = (await Repositories.find()).reverse()
        const result = [];
        const FilteredItem: any = [];

        Item.forEach(item => {
            if (!SavedRepo.find((saved: any) => saved.id === item.repo_id && saved.liked)) FilteredItem.push(item)
            else FilteredItem.unshift(item)
        });


        for (let i = 0; i < FilteredItem.length; i += 3) { result.push(FilteredItem.slice(i, i + 3)) }
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