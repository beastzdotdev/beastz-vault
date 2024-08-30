import MillionLint from '@million/lint';
import dns from 'dns';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { PluginOption, defineConfig, loadEnv } from 'vite';
import { checker } from 'vite-plugin-checker';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const envs = loadEnv(mode, process.cwd());
  const plugins: PluginOption[] = [
    react(),
    svgr(),
    checker({
      typescript: true,
      enableBuild: true,
      overlay: false,
    }),
  ];

  if (envs['VITE_USE_MILLION_LINT'] === 'true') {
    plugins.unshift(MillionLint.vite());
  }

  return {
    plugins,
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
  };
});
