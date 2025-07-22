import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono API!' })
})

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app