import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Changed from 5173 to 3000
    host: true,      // Allow external connections
    open: true,      // Auto-open browser
    strictPort: true // Don't try other ports if 3000 is busy
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          charts: ['recharts', '@mui/x-charts'],
          data: ['@tanstack/react-query', 'axios', '@mui/x-data-grid'],
          forms: ['react-hook-form', 'zod']
        }
      }
    }
  }
})