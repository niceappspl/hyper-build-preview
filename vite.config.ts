import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Polyfills dla modułów Node.js
      assert: 'assert',
      buffer: 'buffer',
      util: 'util',
      process: 'process',
    },
  },
  optimizeDeps: {
    include: ['assert', 'buffer', 'util', 'process'],
  },
  define: {
    'process.env': {},
    'global': 'window',
  },
})
