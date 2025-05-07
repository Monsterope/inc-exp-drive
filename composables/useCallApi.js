export default function useCallApi(){

    const token = useCookie("token")
    const headersParams = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    if (token.value){
        headersParams.Authorization = `Bearer ${token.value}`
    }
    
    // const rtConfig = useRuntimeConfig()
    
    let api = $fetch.create({
        // baseURL: rtConfig.public.API_URL,
        headers: headersParams,
        credentials: 'include',
    })

    return {
        api
    }
    
}