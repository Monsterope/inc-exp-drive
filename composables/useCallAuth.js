export default function useCallAuth(){

    const headersParams = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    
    let api = $fetch.create({
        headers: headersParams,
        credentials: 'include',
    })

    return {
        api
    }
    
}