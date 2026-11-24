import { defineConfig } from 'vite';

export default defineConfig({
    root: 'src',
    clearScreen: false,
    server: {
        strictPort: true,
        port: 5173
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
});
