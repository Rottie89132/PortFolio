export default defineNuxtRouteMiddleware(async (to, from) => {
    const visted = useSessionStorage('Visted', false)
    const { $pwa, $csrfFetch }: any = useNuxtApp()
    const { data }: Record<string, any> = await useFetch('/api/users')
    useLocalStorage('RepoPage', 1)

    if (!visted.value && process.client && !$pwa.isInstalled) {
        if (data.value.statusCode !== 200) {
            await $csrfFetch('/api/analytics', { method: 'POST', });
            visted.value = true
        }
    }
})
