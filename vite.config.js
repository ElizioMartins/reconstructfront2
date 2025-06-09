import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: {
      proxy: {
        '/api': {
          target: 'https://deploy-preview-8--imc-sgs-app.netlify.app',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};