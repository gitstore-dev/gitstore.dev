import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Root domain for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Single bundle for simplicity
      },
    },
  },
});
