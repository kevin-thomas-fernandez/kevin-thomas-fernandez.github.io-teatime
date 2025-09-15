import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/kevin-thomas-fernandez.github.io-teatime/',
  server: {
    port: 3000,
    open: true
  }
})
