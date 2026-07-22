// Registers the service worker for offline support + installability.
// Emits window events the PwaBanner listens for:
//   'sw-update-ready'  → a new version is waiting to activate
// Skipped in dev unless explicitly enabled (SW caching complicates HMR).
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return; // only register in the built/preview app

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}service-worker.js`,
        { scope: import.meta.env.BASE_URL }
      );

      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          // A new SW is installed while an old one still controls the page.
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('sw-update-ready', { detail: reg }));
          }
        });
      });
    } catch (err) {
      console.warn('[CareConnect] Service worker registration failed:', err);
    }
  });
}
