import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(
      {
        include: "**/*.tsx/*.jsx",
      }
    ),
    basicSsl()
  ],
  base: '/bankdemo',
  server: {
    proxy: {
      "/api": {
        target: "https://172.30.17.115:8082/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
