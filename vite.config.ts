import dns from 'dns';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
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
