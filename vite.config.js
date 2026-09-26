import { defineConfig } from 'vite';

// Dev rejimda /api so'rovlari real Express serverga (npm run server) yo'naltiriladi —
// Do'kon purchase balans/inventar real SQLite DB bilan ishlashi uchun.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      // Profil rasmlari Express server file storage'ida (server/uploads) —
      // dev rejimda ham rasm ko'rinishi uchun proxy qilinadi.
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@capacitor')) return 'vendor-capacitor';
            if (id.includes('bcrypt') || id.includes('jsonwebtoken')) return 'vendor-auth';
            if (id.includes('JSCPP')) return 'vendor-jscpp';
            if (id.includes('sql.js')) return 'vendor-sqljs';
            if (id.includes('pyodide')) return 'vendor-pyodide';
            if (id.includes('node-telegram-bot-api') || id.includes('firebase-admin') || id.includes('qrcode-generator')) return 'vendor-misc';
            return 'vendor-core';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          if (/\.(png|jpe?g|svg|gif|webp|avif|ico)$/i.test(name)) {
            return 'assets/img/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|eot|otf)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // WASM / pyodide / vendor jscpp va sql.js public/ ichida — ularga tegmaymiz,
    // shunchaki worker entry pointlarni alohida chunk qilib olish:
    worker: {
      rollupOptions: {
        output: {
          chunkFileNames: 'workers/[name]-[hash].js',
          assetFileNames: 'workers/[name]-[hash][extname]'
        }
      }
    }
  }
});
