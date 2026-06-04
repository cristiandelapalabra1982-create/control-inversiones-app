 import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [

    react(),

    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
       enabled: true
      },
      
      manifest: { 
        name: 'Control Inversiones',

        short_name: 'Inversiones',

        description:
          'Dashboard financiero inteligente',

        theme_color: '#0f172a',

        background_color: '#0f172a',

        display: 'standalone',

        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })

  ]

})