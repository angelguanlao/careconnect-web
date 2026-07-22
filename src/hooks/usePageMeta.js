import { useEffect } from 'react';

// Sets a unique <title> and <meta name="description"> per route (SEO §3.1).
// In this SPA the tags are updated on the client; a production SSR/history-router
// build would emit them server-side per URL.
const SUFFIX = 'CareConnect';
const DEFAULT_TITLE = 'CareConnect — Accessible Health Portal';

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${SUFFIX} — ${title}` : DEFAULT_TITLE;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);
}
