import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            treeshake: {
                // Utilisation d'une option plus permissive pour le tree-shaking
                moduleSideEffects: 'no-external',
            },
        },
    },
})