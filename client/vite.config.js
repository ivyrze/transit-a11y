import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import generouted from '@generouted/react-router/plugin'
import jsconfigPaths from 'vite-jsconfig-paths';
import svgr from "vite-plugin-svgr";

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            }
        }
    },
    plugins: [ jsconfigPaths(), react(), generouted(), svgr() ],
})