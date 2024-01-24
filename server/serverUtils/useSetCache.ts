export default async (response: any, token: any) => {
    await useStorage("Cache").setItem(token, response.data)
    setTimeout(async () => {
        await useStorage("Cache").removeItem(token)
    }, 30 * 60 * 1000)
};

//// import fs from 'fs';
//// const expirationDate = new Date()
//// expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000) // 30 minutes

//// fs.writeFileSync(`./server/cache/${token}.json`, JSON.stringify({
////     expires: expirationDate.toISOString(),
////     ...response.data
//// }));