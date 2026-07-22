# CareConnect — Web (React + Vite, PWA) · SWEN 661 Week 10

The responsive, installable **web build** of the CareConnect patient health portal.
Built with React 18 + React Router + Vite, matched to the Team 9 Figma
hi-fi mockups, and engineered for WCAG 2.1 AA accessibility.

> This lives alongside the Week 7–9 Electron desktop app in the same repo. The
> desktop app is in the repo root (`src/`); this web build is self-contained in `web/`.

## Run it

```bash
cd web
npm install
npm run dev        # Vite dev server → http://localhost:5173
```

Demo auth (no backend): any valid-looking email + any non-empty password signs
in. Try `sarah.chen@careconnect.health` / `password`.

```bash
npm run build      # production build → web/dist
npm run preview    # serve the built app (service worker + install prompt active)
```

The service worker and PWA install prompt only run in the **built/preview** app,
not the dev server.

## Capturing the responsive screenshots (Week 10 §1)

Use Chrome DevTools device toolbar (⌘⇧M / Ctrl+Shift+M) and set the width:

| Breakpoint | Width  | Layout |
|-----------|--------|--------|
| Mobile    | 375px  | Single column, fixed **bottom tab bar**, stacked cards |
| Tablet    | 768px  | Dark sidebar + content, 2-column feature grid, no appointments side column |
| Desktop   | 1440px | Dark sidebar + content, 3-up metric/feature grids, appointments side column |

## Project structure

```
web/
├─ index.html                 # SEO meta, OG tags, manifest link, font preloads
├─ vite.config.js             # base './' for portable hosting
├─ public/
│  ├─ manifest.webmanifest    # PWA manifest (name, icons, display, theme, shortcuts)
│  ├─ service-worker.js       # caching strategies + offline fallback
│  ├─ fonts/                  # self-hosted Epilogue + Nunito Sans (.woff2)
│  └─ icons/                  # PWA icons (192/512/maskable) + OG image
└─ src/
   ├─ main.jsx                # root render + SW registration
   ├─ App.jsx                 # router + auth gate + providers
   ├─ registerSW.js           # service-worker registration + update events
   ├─ styles/index.css        # design system (tokens, components, responsive)
   ├─ context/
   │  ├─ AuthContext.jsx       # demo auth + persisted user store
   │  ├─ PreferencesContext.jsx# accessibility prefs → <html> data-attrs + localStorage
   │  └─ ToastContext.jsx      # toasts + aria-live announcements
   ├─ components/
   │  ├─ AppLayout.jsx         # shell: sidebar / main / bottom tab bar
   │  ├─ IconSprite.jsx        # inline SVG symbol sprite
   │  ├─ Icon.jsx, Toggle.jsx, TagInput.jsx, PwaBanner.jsx
   ├─ pages/
   │  ├─ Login.jsx  Dashboard.jsx  Features.jsx
   │  ├─ Notifications.jsx  Profile.jsx  Settings.jsx  Search.jsx
   └─ data/mockData.js        # nav, metrics, appointments, features, notifications, user
```

## PWA plan (Week 10 §2)

- **Web App Manifest** (`public/manifest.webmanifest`): name *CareConnect —
  Accessible Health Portal*, `short_name` CareConnect, `display: standalone`,
  `theme_color #2C7A7B`, `background_color #F3F5F6`, `start_url ./?source=pwa`,
  192/512/maskable PNG icons, and two app **shortcuts** (Dashboard, Notifications).
- **Service worker** (`public/service-worker.js`):
  - **App-shell navigations → Network First**, falling back to cache, then to the
    cached `index.html` offline shell. HTML stays fresh online; the app still
    opens offline.
  - **Static assets (JS/CSS/fonts/icons) → Stale-While-Revalidate**: serve the
    cached copy instantly, refresh in the background.
  - Versioned caches (`careconnect-v1`) are cleaned up on `activate`.
- **Offline support**: the shell, manifest, icons, and both font files are
  precached, so the UI loads with no connection. Dynamic API data (not present in
  this demo) would layer on top of the cached shell.
- **Installability**: `beforeinstallprompt` is captured and surfaced as an
  "Install CareConnect" banner (`PwaBanner.jsx`); an update banner offers a
  refresh when a new service worker is waiting. iOS `apple-touch-icon` +
  `apple-mobile-web-app-*` tags support Add to Home Screen.
- **Push notifications (optional / future)**: the Settings → Notifications "Push
  notifications" toggle is the intended entry point; a real build would request
  `Notification` permission and register a push subscription for appointment and
  prescription reminders.

## SEO strategy (Week 10 §3)

- **Titles + meta descriptions**: unique `<title>` and `<meta name="description">`
  in `index.html`; a production multi-page build would set per-route metadata.
- **Open Graph / social**: `og:title/description/url/image` + Twitter card tags,
  with a generated 1200×630 `og-image.png`.
- **Heading hierarchy**: one `<h1>` per screen (page title), `<h2>` for sections
  (e.g. *Today's health summary*), `<h3>` for cards — no skipped levels.
- **Image alt-text policy**: informational images get descriptive `alt`;
  decorative icons are `aria-hidden` inline SVG (they never carry unique meaning
  alone — always paired with a text label).
- **URLs / slugs**: clean, lowercase, hyphenated route slugs
  (`/features`, `/notifications`, `/profile`, `/settings`). Hash routing is used
  for zero-config static hosting; a server/SSR build would switch to history
  routing with the same slugs.

## Semantic HTML (Week 10 §5)

`<header>` (page + card headers), `<nav>` (sidebar primary nav, mobile bottom
nav, footer nav), `<main id="main">` (routed content, skip-link target),
`<section>` with `aria-labelledby` for each dashboard block, `<article>`-style
cards, `<aside>` (profile summary), `<footer>` (contentinfo). Forms use
`<label for>` associated with every input; the settings switches are real
`<input type="checkbox" role="switch">`.

## ARIA patterns (Week 10 §6)

- **Landmarks**: `nav` (banner-level primary navigation), `main`, `search`
  (search form), `contentinfo` (footer). One labelled main navigation.
- **`aria-current="page"`** on the active nav link (sidebar + bottom bar).
- **`aria-label` / `aria-labelledby`** on icon-only buttons (bell, search, edit,
  password toggle, +/− text-size) and on every landmark and section.
- **`aria-live`**: a polite live region announces route changes, toggles, and
  toasts (`ToastContext`); the search result count is `aria-live="polite"`.
- **Switches**: `role="switch"` + `aria-checked`; the password reveal uses
  `aria-pressed`; notification filters use `aria-pressed` on the pills.
- **Focus management**: skip link to `#main`; on route change focus moves to the
  screen `<h1>`; visible `:focus-visible` rings everywhere; 44×44px min targets.
- **Keyboard**: Ctrl+1/2/3 nav, Ctrl+F search, Ctrl+, settings, Ctrl+Alt+H high
  contrast, F1 settings.

## Accessibility settings

High-contrast (AAA) theme, text scaling 0.8×–2.0×, reduce-motion, and screen-
reader optimizations (wider spacing) — all in Settings, applied instantly and
persisted to `localStorage`. Reduce-motion also honors the OS
`prefers-reduced-motion` media query.

## AI usage acknowledgment (Week 10 policy)

- **Figma AI** — used by the design team to generate and refine the responsive
  layouts and hi-fi mockups (the source of truth this build matches).
- **Claude (Claude Code)** — used to scaffold the Vite/React project, port the
  design system to CSS tokens, implement the components/pages, and wire the PWA
  and accessibility features. All generated code was reviewed, run, and verified
  in-browser against the Figma mockups before inclusion.

The team remains responsible for the accuracy, quality, functionality, and
originality of all submitted work.

## Fonts

Epilogue (display) and Nunito Sans (body) are **self-hosted** as `.woff2` in
`public/fonts/` (latin variable subset, ~66 KB total) so they work offline in the
PWA with no external CDN calls. Both are Open Font License.
