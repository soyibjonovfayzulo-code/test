import { defineConfig } from 'vite';

// Dev rejimda /api so'rovlari real Express serverga (npm run server) yo'naltiriladi —
// Do'kon purchase balans/inventar real SQLite DB bilan ishlashi uchun.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
