import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@services': path.resolve(__dirname, './src/services'),
      '@app': path.resolve(__dirname, './src/app'),
      '@apps': path.resolve(__dirname, './src/apps'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    port: 3005,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3006',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Cache busting: Add content hash to all chunks and assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Core React libraries
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // State management & forms
          'vendor-state': [
            'zustand',
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          // Charts & data visualization
          'vendor-charts': [
            'recharts',
            'chart.js',
            'react-chartjs-2',
          ],
          // UI & animations
          'vendor-ui': [
            'framer-motion',
            'lucide-react',
            'react-confetti',
          ],
          // Network & API
          'vendor-network': [
            'axios',
            'socket.io-client',
          ],
        },
      },
    },
  },
});
