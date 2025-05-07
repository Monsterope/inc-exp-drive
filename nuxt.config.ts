// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
import ui from "@nuxt/ui/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    API_URL: process.env.DATA_URL,
    public: {
      AUTH_URL: process.env.AUTH_URL,
      API_URL: process.env.API_URL,
    }
  },
  
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/ui'],
  vite: {
    plugins: [
      tailwindcss(),
      ui()
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },

  css: [
    '~/assets/css/main.css',
  ],
})