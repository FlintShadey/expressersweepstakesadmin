import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(() => {
  const basePath =
    process.env.VITE_BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/expressersweepstakesadmin/" : "/");

  return {
    base: basePath,
    plugins: [
      vue(),
      vueDevTools(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          navigateFallback: "/expressersweepstakesadmin/",
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
          runtimeCaching: [
            {
              urlPattern: /^\/expressersweepstakesadmin\/.*/,
              handler: "NetworkFirst",
              options: {
                cacheName: "pages",
                networkTimeoutSeconds: 5,
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "documents",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
                },
              },
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
          ],
        },
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "apple-touch-icon-180x180.png",
          "masked-icon.svg",
          "pwa-192x192.png",
          "pwa-512x512.png",
        ],
        manifest: {
          name: "Expresser Sweepstakes Admin",
          short_name: "Sweepstakes",
          description: "Admin interface for managing sweepstakes entries",
          theme_color: "#1976d2",
          background_color: "#121212",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: basePath,
          scope: basePath,
          categories: ["business", "productivity", "utilities"],
          icons: [
            {
              src: basePath + "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: basePath + "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: basePath + "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: basePath + "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: basePath + "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
  };
});
