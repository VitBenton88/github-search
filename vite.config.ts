import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const viteConfig = defineViteConfig({
  base: '/github-search/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mocks': path.resolve(__dirname, './src/test/__mocks__')
    },
  },
})

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: './src/test/vitest.setup.ts',
    // Pin timezone/locale so date-formatting assertions are deterministic
    // across dev machines and CI (which runs in UTC), instead of depending
    // on whatever timezone/locale happens to run the test.
    env: {
      TZ: 'UTC',
      LANG: 'en-US'
    }
  }
})

export default mergeConfig(viteConfig, vitestConfig)