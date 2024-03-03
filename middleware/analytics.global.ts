export default defineNuxtRouteMiddleware(async (to, from) => {
    const visted = useSessionStorage('Visted', false)
    const { $pwa, $csrfFetch }: any = useNuxtApp()
    useLocalStorage('RepoPage', 1)

    if (process.client) {
        if (!visted.value) {
            await $csrfFetch('/api/analytics', { method: 'POST', });
            visted.value = true
        }
    }

})
