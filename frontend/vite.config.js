import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 127.0.0.1, not localhost: Node resolves localhost to IPv6 first, uvicorn listens on IPv4
  server: { proxy: { '/api': 'http://127.0.0.1:8000' } },
})
