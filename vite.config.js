import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://imc-bpv-back-7c65e7c5f526.herokuapp.com',
        changeOrigin: true,
        secure: false, 
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
