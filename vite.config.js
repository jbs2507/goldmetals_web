import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // react-router usa "cookie" y "set-cookie-parser" (CommonJS). Se fuerza su pre-empaquetado
  // para que el navegador no los cargue crudos (errores: "does not provide an export named
  // 'parse'" / "'splitCookiesString'").
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-router',
      'cookie',
      'set-cookie-parser',
    ],
  },
})
