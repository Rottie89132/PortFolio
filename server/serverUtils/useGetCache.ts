export default async (token: any) => {
    const data = await useStorage("Cache").getItem(token)
    if (!data) return false
    return { data }   
};
