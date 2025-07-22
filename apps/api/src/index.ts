import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

// APIルート定義
const routes = app
  .get('/', (c) => {
    return c.json({ message: 'Hello from Hono API!' })
  })
  .get('/api/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() })
  })
  .get('/api/users', (c) => {
    return c.json({
      users: [
        { id: 1, name: '田中太郎', email: 'tanaka@example.com', role: 'admin' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'user' },
        { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'user' },
      ],
      total: 3,
      timestamp: new Date().toISOString()
    })
  })
  .get('/api/users/:id', 
    zValidator('param', z.object({
      id: z.string().transform(Number)
    })),
    (c) => {
      const { id } = c.req.valid('param')
      const users = [
        { id: 1, name: '田中太郎', email: 'tanaka@example.com', role: 'admin' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'user' },
        { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'user' },
      ]
      const user = users.find(u => u.id === id)
      
      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }
      
      return c.json(user)
    }
  )
  .get('/api/stats', (c) => {
    return c.json({
      stats: {
        totalUsers: 1234,
        activeUsers: 987,
        totalPosts: 5678,
        todayPosts: 123,
      },
      lastUpdated: new Date().toISOString()
    })
  })

// RPC用の型をエクスポート
export type ApiType = typeof routes

export default routes