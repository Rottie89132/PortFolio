export default defineNuxtRouteMiddleware(async (to, from) => {
    const visted = useSessionStorage('Visted', false)
    const { $csrfFetch }: any = useNuxtApp()
    useLocalStorage('RepoPage', 1)

    if (document) {
        if (!visted.value) {

            const data: Record<string, any> = await useFetch("/api/users")
            if (!data.data.value?.authorized){
                await $csrfFetch('/api/analytics', { method: 'POST', });
                visted.value = true
            }

        }
    }

})
