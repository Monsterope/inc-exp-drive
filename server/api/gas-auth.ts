// server/api/gas-proxy.ts
export default defineEventHandler(async (event) => {
  
    const rtConfig = useRuntimeConfig()
  
    const response = await $fetch(`${rtConfig.public.AUTH_URL}/exec?Authorization=${event.req.headers['authorization']}`, {
      method: 'GET',
      headers: {
        // คุณจะใส่ Authorization, Content-Type ฯลฯ ได้ตามปกติ
        Authorization: event.req.headers['authorization'] || '',
        'Content-Type': 'application/json',
      },
    })
  
    return response
  })
  