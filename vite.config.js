import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/frontend-4_Week-2-Project_Nov-30/',
  plugins: [react()],
})
