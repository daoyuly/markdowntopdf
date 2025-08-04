import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['../wasm/wasm_crypto.js']
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    rollupOptions: {
      external: ['../wasm/wasm_crypto.js']
    }
  }
}) 