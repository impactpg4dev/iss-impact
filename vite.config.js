import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/gas': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gas/, ''),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'https://script.google.com');
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})