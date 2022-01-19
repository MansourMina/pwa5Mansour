importScripts("/precache-manifest.7523fd57ccd4923864db63fa81f9e964.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.setConfig({ debug: true });
  workbox.precaching.precacheAndRoute(self.__precacheManifest);
  // workbox.routing.registerRoute(
  //   '/employees',
  //   new workbox.strategies.NetworkFirst({
  //     cacheName: 'minas-cache',
  //   }),
  // );
  workbox.routing.registerRoute(
    new RegExp('/images/.*.jpg'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'roberts-image-cache',
    }),
  );
} else {
  console.log(`Workbox didn't load`);
}
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body.message,
    icon: 'img/icons/employees_192x192.png',
  });
});
self.skipWaiting();

