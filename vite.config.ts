import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` is relative so the built site can be hosted from any sub-path
// (e.g. GitHub Pages project sites) without hardcoding absolute paths.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // .wav files live in public/ and are copied verbatim, never inlined.
    assetsInlineLimit: 0,
  },
});
