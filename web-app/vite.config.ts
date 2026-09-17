import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': r('./src/app'),
      '@core': r('./src/core'),
      '@modules': r('./src/modules'),
      '@shared': r('./src/shared'),
      '@store': r('./src/store'),
      '@styles': r('./src/styles'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('zustand')) {
              return 'vendor-state'
            }
            if (id.includes('axios') || id.includes('zod')) {
              return 'vendor-utils'
            }
          }
        },
      },
    },
  },
})
