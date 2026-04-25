import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Rewrite redirect Location headers so they point back to the proxy, not the backend
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const location = proxyRes.headers['location'];
            if (location && location.includes('localhost:8000')) {
              proxyRes.headers['location'] = location.replace('http://localhost:8000', '');
            }
          });
        },
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
