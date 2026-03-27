import { defineConfig } from 'vite';

export default defineConfig({
  // Use root path for custom domain (gitstore.dev)
  // GitHub Actions will set VITE_BASE_PATH for subdirectory deployment
  base: '/',
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
