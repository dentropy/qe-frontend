import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/napi': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '')
      },
      '/apps': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [react()],
})
