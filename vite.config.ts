import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

// Public routes to pre-render at build time. Each gets a real HTML file with
// per-route <title>, meta tags and JSON-LD baked in — crawlers no longer wait
// for JS hydration. Private/dynamic routes are intentionally excluded.
const PRERENDER_ROUTES = [
  '/',
  '/planes',
  '/ejemplos',
  '/concierge-service',
  '/terminos',
  '/aviso-de-privacidad',
  // SEO programmatic landing pages
  '/invitaciones-digitales-boda',
  '/invitaciones-digitales-xv-anos',
  '/invitaciones-digitales-cumpleanos',
  '/invitaciones-digitales-cdmx',
  '/invitaciones-digitales-guadalajara',
  '/invitaciones-digitales-monterrey',
  '/invitaciones-digitales-vs-papel',
  '/invitto-vs-paperless-post',
  '/invitto-vs-greenvelope',
  '/comparativas',
  '/planes/clasica',
  '/planes/pro',
  '/planes/premium',
  '/planes/concierge',
  '/blog',
  '/blog/ventajas-invitaciones-digitales-boda',
  '/blog/confirmacion-invitados-xv-anos',
  '/blog/protocolo-invitaciones-digitales-whatsapp',
  '/blog/guia-texto-invitacion-boda',
  '/blog/invitaciones-digitales-vs-papel-ecologia',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-rendering only runs during `vite build`, not in dev.
    prerender({
      routes: PRERENDER_ROUTES,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        // Wait long enough for the React app to mount and helmet-async to inject tags.
        renderAfterTime: 1500,
        maxConcurrentRoutes: 2,
      },
      postProcess(renderedRoute) {
        // Strip any localhost remnants picked up during pre-render.
        renderedRoute.html = renderedRoute.html.replace(
          /localhost:\d+/g,
          'invitto.com.mx'
        )
      },
    }),
  ],
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
