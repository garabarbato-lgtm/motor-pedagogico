import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/dc_pba_base_curricular_corregida.json': 'http://localhost:3000',
    }
  }
})
