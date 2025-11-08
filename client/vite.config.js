import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'

// Cargar variables desde .env
dotenv.config()

// Obtener URL de la API desde .env o usar fallback
const API_URL = process.env.VITE_API_URL || 'https://api.smoke-and-grill.com/api'

// ================================
// CONFIGURACIÓN PRINCIPAL DE SMOKE & GRILL PWA
// ================================

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Restaurante Smoke & Grill',
        short_name: 'Smoke&Grill',
        description: 'PWA para pedidos, reservaciones y administración del restaurante Smoke & Grill.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        scope: '/',
        orientation: 'portrait',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      workbox: {
        navigateFallback: '/index.html',
        globPatterns: [
          '**/*.{js,css,html,png,svg,jpg,jpeg,webp,woff2,woff,ttf,json}'
        ],
        runtimeCaching: [
          // 1️⃣ Páginas principales
          {
            urlPattern: /^https:\/\/smoke-and-grill\.com\/(menu|carrito|perfil|pedidos|reservaciones|inicioCliente|empresa)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60
              }
            }
          },
          // 2️⃣ Imágenes
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          },
          // 3️⃣ API Backend (usando .env)
          {
            urlPattern: new RegExp(API_URL.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ]
})
