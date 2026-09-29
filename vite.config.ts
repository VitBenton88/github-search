import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig as defineViteConfig, mergeConfig, type Plugin } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// GitHub Pages can't send response headers, so ship the CSP as a <meta> tag. Build-only:
// the dev server injects inline scripts (React Refresh) that this policy would block.
const contentSecurityPolicy = [
  "default-src 'self'",
  'connect-src https://api.github.com',
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

const cspMetaTag = (): Plugin => ({
  name: 'csp-meta-tag',
  apply: 'build',
  transformIndexHtml: () => [{
    tag: 'meta',
    attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
    injectTo: 'head-prepend',
  }],
})

const viteConfig = defineViteConfig({
  base: '/github-search/',
  plugins: [react(), cspMetaTag()],
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