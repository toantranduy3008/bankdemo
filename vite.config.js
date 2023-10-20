import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(
    {
      include: "**/*.tsx/*.jsx",
    }
  )],
  base: '/bankdemo',
  server: {
    proxy: {
      "/api": {
        target: "https://qrrealtime-dev.napas.com.vn/bankdemo/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
