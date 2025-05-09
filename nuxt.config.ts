// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "nuxt-highcharts",
    // "nuxt-swiper",
    // '@primevue/nuxt-module',

    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    "@nuxt/icon",
  ],

  plugins: ["~/plugins/axios.ts"],

  imports: {
    dirs: ["stores"],
  },

  build: {
    transpile: ["vue-chartjs", "chart.js"],
  },

  compatibilityDate: "2024-09-16",
});