export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const itemsPerPage = 3;
        const currentPage = Number(getRouterParams(event).page) - 1 || 0;
        const skip = currentPage * itemsPerPage;

        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        const totalItems = await Repositories.countDocuments();
        const Item = await Repositories.find().sort({ liked_byId: -1, created_at: -1, }).skip(skip).limit(itemsPerPage);

        if (!Item || Item.length === 0) {
            return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found."
            });
        }

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded.",
            page: currentPage + 1,
            total: Math.ceil(totalItems / itemsPerPage),
            Response: Item.map((item: any) => ({ ...item._doc, liked_byId: undefined, liked: item._doc.liked_byId.includes(user?.Id) }))
        });
    });
});