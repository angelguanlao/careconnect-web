import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CareConnect web build.
// `base: './'` keeps asset paths relative so the built app works both when
// served from the domain root and from a project sub-path (e.g. GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, open: true }
});
