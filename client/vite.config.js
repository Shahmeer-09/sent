import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/s1":{
        // target:"https://sent-rose.vercel.app",
        target:"http://localhost:8000",
        secure:false,
      }
    }
  }, 
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //   },
  // }
})
