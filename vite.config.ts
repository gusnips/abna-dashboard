import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/abna-campaign-dashboard/' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  }
})
