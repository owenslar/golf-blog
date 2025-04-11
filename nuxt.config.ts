import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  build: {
    transpile: ['tslib'],
  },

  // serverHandlers: [
  //   { route: '/api', handler: '~/server/server.js'}
  // ],

  // vite: {
  //   server: {
  //     proxy: {
  //       '/api': {
  //         target: 'http://localhost:8000',
  //         changeOrigin: true
  //       }
  //     }
  //   },
  // },

  nitro: {
    preset: 'node-server',
    externals: {
      inline: ['@aws-sdk/client-dynamodb']
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8000'
    },
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000'
  },


})