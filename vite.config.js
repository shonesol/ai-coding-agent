import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Replace 'unrestricted-ai-app' with your exact GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/unrestricted-ai-app/' : '/',
  server: {
    port: 5173
  }
})
