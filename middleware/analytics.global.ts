export default defineNuxtRouteMiddleware(async (to, from) => {
    const visted = useSessionStorage('Visted', false)  
    const { data }: Record<string, any> = await useFetch('/api/users')
    useLocalStorage('RepoPage', 1)

    if(!visted.value && process.client){
        if (data.value.statusCode !== 200){
            visted.value = true
            await $fetch('/api/analytics', { method: 'POST', })
        }
    }
})



