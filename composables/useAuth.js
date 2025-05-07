export default function useAuth() {
    const token = useCookie("token")
    const user = useState('auth-user', () => null)
    
    const { api } = useCallAuth()

    async function login(loginForm) {
        try {
            const data = await api("/api/gas-proxy", {
                method: "POST",
                body: loginForm
            })
            if (data.status == 200){
                token.value = data.access_token
            }
        } catch (e) {
            console.log("sss", e)
            token.value = null
        }
    }
    
    async function fetchUser() {
        const tokenCur = token.value
        try {
            const data = await api(`/api/gas-auth`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${tokenCur}` 
                }
            })
            if (data.status == 200){
                user.value = data
            }
        } catch (e) {
            user.value = null
            console.log("error")
        }
    }

    async function logout() {
        const tokenCur = !token ? localStorage.getItem("token") : token
        try {
            await api("/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${tokenCur}` 
                }
            })
            localStorage.removeItem("token")
            user.value = null
        } catch (e) {
            user.value = null
            console.log(e)
        }
    }

    return {
        token,
        user,
        login,
        logout,
        fetchUser,
      }
    
}