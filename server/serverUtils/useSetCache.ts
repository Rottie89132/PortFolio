export default async (response: any, token: any) => {
    await useStorage("Cache").setItem(token, response.data)
    setTimeout(async () => {
        await useStorage("Cache").removeItem(token)
    }, 30 * 60 * 1000)
};
