import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // ✅ Set to '/' for root deployment (Vercel, Netlify, etc.)
  // Change to '/repo-name/' if deploying to GitHub Pages in a subdirectory
  base: '/',

  build: {
    // ✅ Target modern browsers — smaller, faster output
    target: 'es2020',

    // ✅ No source maps in production (don't expose your source code)
    sourcemap: false,

    // ✅ Increase warning threshold (GSAP + images can be large)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // ✅ Split vendor libraries into separate cached chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap-vendor': ['gsap'],
        },
        // ✅ Organised output filenames
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  server: {
    port: 5173,
    open: true, // ✅ Auto-open browser on dev start
  },

  preview: {
    port: 4173,
  },
})