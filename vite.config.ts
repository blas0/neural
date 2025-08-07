import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // Increase chunk size warning limit to 750kb (current bundle is 561kb)
    chunkSizeWarningLimit: 750,
    
    // Enable source maps for better debugging in production
    sourcemap: false, // Set to true for staging/debug builds
    
    // Optimize build output
    minify: 'esbuild',
    target: 'es2020',
    
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'ui-vendor': ['lucide-react', '@floating-ui/react'],
          'visx-vendor': [
            '@visx/axis',
            '@visx/curve', 
            '@visx/gradient',
            '@visx/group',
            '@visx/heatmap',
            '@visx/scale',
            '@visx/shape'
          ],
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
    hmr: {
      overlay: false
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