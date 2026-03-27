import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gitstore.dev/',  // GitHub Pages subdirectory path
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
