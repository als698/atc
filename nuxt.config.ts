// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ["~/assets/scss/main.scss"],
  modules: ["nuxt-icon", "@nuxtjs/google-fonts", "@nuxtjs/tailwindcss"],
  googleFonts: {
    families: {
      Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  devtools: { enabled: true },
});
