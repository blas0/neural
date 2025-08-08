import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // Reduce chunk size warning for better mobile performance
    chunkSizeWarningLimit: 500,
    
    // Enable source maps for better debugging in production
    sourcemap: false, // Set to true for staging/debug builds
    
    // Optimize build output for mobile
    minify: 'esbuild',
    target: 'es2020',
    
    // Optimize for mobile loading
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks for better caching and mobile performance
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-vendor': ['lucide-react'],
          'floating-ui': ['@floating-ui/react'],
          'visx-core': ['@visx/axis', '@visx/curve', '@visx/gradient', '@visx/group'],
          'visx-heavy': ['@visx/heatmap', '@visx/scale', '@visx/shape'],
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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})