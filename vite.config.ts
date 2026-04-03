import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2020',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — never changes between deploys, maximizes CDN cache hits
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase client — large and stable
          'supabase-vendor': ['@supabase/supabase-js'],
          // Framer Motion — heavy animation lib, only changes on upgrade
          'motion-vendor': ['framer-motion'],
          // Recharts — only loaded inside dashboard pages
          'charts-vendor': ['recharts'],
          // Date formatting — shared across many pages
          'date-vendor': ['date-fns'],
        },
      },
    },
  },
})
