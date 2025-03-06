// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@nuxt/eslint", "@nuxt/icon", "nuxt-auth-utils"],
  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "secret",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
});
