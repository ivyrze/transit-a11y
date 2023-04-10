import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
    plugins: [ react({
        babel: {
            plugins: [
                'transform-react-pug',
                [ 'transform-jsx-classname-components', {
                    objects: [ 'React', 'ThemeContext', 'ErrorStatusContext', 'AuthContext' ]
                } ]
            ]
        }
    }) ],
})