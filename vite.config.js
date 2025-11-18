import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cấu hình base URL cho assets khi deploy lên subdomain
  // Uncomment và thay đổi khi cần deploy lên CDN/subdomain
  // base: process.env.VITE_ASSETS_BASE_URL || '/',
  build: {
    assetsDir: 'assets',
    // Tối ưu hóa assets
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  // TypeScript support
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})

