import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: path.resolve(__dirname, 'server', 'client'),
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'server', 'client', 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'server', 'client', 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'server', 'client')
    }
  }
});