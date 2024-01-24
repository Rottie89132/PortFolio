export default async (token: any) => {
    const data = await useStorage("Cache").getItem(token)
    if (!data) return false
    return { data }   
};


//// import fs from 'fs';
//// const filePath = `./server/cache/${token}.json`;

//// if (!fs.existsSync(filePath)) {
////     return false;
//// }

//// const file = fs.readFileSync(filePath, 'utf-8');
//// const data = await JSON.parse(file);

//// const expiration = new Date(data.expires).getTime()
//// if (expiration > new Date().getTime()) return { data }
//// return false