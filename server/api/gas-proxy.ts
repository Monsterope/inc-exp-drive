// server/api/gas-proxy.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const rtConfig = useRuntimeConfig()
  
    const response = await $fetch(`${rtConfig.public.AUTH_URL}/exec`, {
      method: 'POST',
      body,
      headers: {
        // คุณจะใส่ Authorization, Content-Type ฯลฯ ได้ตามปกติ
        Authorization: event.req.headers['authorization'] || '',
        'Content-Type': 'application/json',
      },
    })
  
    return response
  })
  