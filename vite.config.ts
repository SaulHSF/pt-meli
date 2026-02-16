import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/domain/services/**/*.ts',
        'src/application/**/*.ts',
        'src/adapters/**/*.ts',
        'src/stores/**/*.ts',
      ],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      thresholds: {
        lines: 75,
        functions: 75,
        statements: 75,
        branches: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
