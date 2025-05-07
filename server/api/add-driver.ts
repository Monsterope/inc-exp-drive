// server/api/add-driver.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const rtConfig = useRuntimeConfig()
  
    const response = await $fetch(`${rtConfig.public.API_URL}/exec?Authorization=${event.req.headers['authorization']}`, {
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
  