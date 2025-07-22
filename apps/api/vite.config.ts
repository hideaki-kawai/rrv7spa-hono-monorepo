import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import build from '@hono/vite-build'

export default defineConfig({
  plugins: [
    build({
      entry: './src/index.ts',
    }),
    devServer({
      entry: './src/index.ts',
    }),
  ],
})