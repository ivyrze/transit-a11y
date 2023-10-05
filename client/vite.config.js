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
                secure: false,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [ jsconfigPaths(), react(), generouted(), svgr() ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'mapbox-gl': [ 'react-map-gl', 'mapbox-gl' ]
                },
            }
        },
    },
});