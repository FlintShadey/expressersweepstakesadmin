// Custom service worker for GitHub Pages PWA
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Handle navigation requests - always return the app
const navigationHandler = new NetworkFirst({
  cacheName: "pages",
  networkTimeoutSeconds: 3,
});

const navigationRoute = new NavigationRoute(
  ({ request }) => {
    // Only handle navigation requests within our app
    return request.mode === "navigate";
  },
  {
    handler: () => {
      return (
        caches.match("/expressersweepstakesadmin/index.html") ||
        fetch("/expressersweepstakesadmin/index.html")
      );
    },
  }
);

registerRoute(navigationRoute);

// Cache images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      {
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}`;
        },
      },
    ],
  })
);
