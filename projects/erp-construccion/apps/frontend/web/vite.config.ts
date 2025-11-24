import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@stores': path.resolve(__dirname, './src/shared/stores'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@constants': path.resolve(__dirname, './src/shared/constants'),
      '@apps': path.resolve(__dirname, './src/apps'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'zustand-vendor': ['zustand'],
          'axios-vendor': ['axios'],
        },
      },
    },
  },
});
