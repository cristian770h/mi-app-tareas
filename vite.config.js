import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'autoUpdate' se registrará automáticamente y actualizará el service worker
      registerType: 'autoUpdate',
      // Activa la inyección del manifiesto en el <head>
      injectRegister: 'auto',
      // Define el workbox para el cacheo de assets
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Define el manifiesto de la PWA
      manifest: {
        name: 'Gestor de Tareas PWA',
        short_name: 'Tareas PWA',
        description: 'Un gestor de tareas simple e intuitivo hecho PWA.',
        theme_color: '#3498db', // Un color azul moderno
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            // Icono "maskable" para una mejor integración con Android
            src: '/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})