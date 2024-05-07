import dns from 'dns';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    checker({
      typescript: true,
      enableBuild: true,
      overlay: false,
    }),
  ],
  esbuild: {
    supported: {
      'top-level-await': true, //browsers can handle top-level-await features
    },
  },
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
  server: {
    host: 'localhost',
    port: 5173,
  },
});
