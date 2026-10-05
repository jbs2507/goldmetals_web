import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // react-router usa "cookie" (CommonJS). Se fuerza su pre-empaquetado para que
  // el navegador no lo cargue crudo (error: "does not provide an export named 'parse'").
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'react-router', 'cookie'],
  },
})
