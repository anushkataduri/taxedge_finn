import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    env: {
      VITE_API_BASE_URL: 'http://localhost:8000/api',
      VITE_ENABLE_MOCKS: 'true',
      VITE_APP_NAME: 'TaxEdge',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
