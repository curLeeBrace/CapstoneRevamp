import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      'process.env': env
    },
    plugins: [react()],
    server: {
      open: true, // Automatically open the app in the default browser
      host : process.env.RAILWAY_PUBLIC_DOMAIN || "localhost",
    },
  }
})