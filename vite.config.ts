import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // Increase chunk size warning limit to reduce noise
    chunkSizeWarningLimit: 600,
    
    // Disable source maps for production builds for better performance
    sourcemap: false,
    
    // Enhanced build optimization
    minify: 'esbuild',
    target: ['es2022', 'chrome100', 'safari15', 'firefox100', 'edge100'],
    
    // CSS optimization
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    
    // Enable build caching
    emptyOutDir: true,
    copyPublicDir: true,
    
    rollupOptions: {
      output: {
        // Optimized manual chunk splitting to avoid empty chunks
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules') && (id.includes('react') || id.includes('react-dom'))) {
            return 'react-vendor';
          }
          // Form libraries
          if (id.includes('node_modules') && (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod'))) {
            return 'form-vendor';
          }
          // UI libraries
          if (id.includes('node_modules') && (id.includes('lucide-react') || id.includes('@floating-ui'))) {
            return 'ui-vendor';
          }
          // ViSX visualization libraries
          if (id.includes('node_modules') && id.includes('@visx')) {
            return 'visx-vendor';
          }
          // Other large vendor dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // Enable dependency pre-bundling optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      'zod',
      'lucide-react',
      '@floating-ui/react'
    ],
    exclude: ['@visx/heatmap', '@visx/scale', '@visx/group'] // Exclude heavy deps from pre-bundling if they're not always used
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: 'localhost',
    open: true, // Auto open browser
    hmr: {
      overlay: true, // Show error overlay for better debugging
      port: 24678, // Custom HMR port to avoid conflicts
    },
    // Force clear cache headers in development
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    },
    // Removed API proxy - conflicts with Vercel serverless functions
  }
})