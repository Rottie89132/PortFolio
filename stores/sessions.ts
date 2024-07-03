

export const useSessionsStore = defineStore("session", () => {
    const session = ref(null)

    const setSession = (data: any) => session.value = data 
    const fetchSessionData = async (endpoint: string) => await $fetch(endpoint)
    const clearSession = () => session.value = null

    const getSession = async () => {

        if (session.value) return session.value
        
        let data: any = await fetchSessionData('/api/users')
        if (!data || data.statusCode !== 200) {
            data = await fetchSessionData("/api/auth/refresh")
        }

        session.value = data
        return session.value
    }

    return {
        setSession,
        getSession,
        clearSession,
    };
});