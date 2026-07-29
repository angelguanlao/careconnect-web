/* ============================================================================
   Week 11 evidence capture.

   Two jobs, both driven by headless Chromium via Playwright so the results are
   deterministic and reproducible (unlike hand-resized browser windows, which
   can't hit an exact CSS viewport width):

     1. rasterise()  — renders the brand SVGs to the PNG sizes the manifest
                       declares (192, 512, maskable 512).
     2. capture()    — screenshots the running app at the three breakpoints the
                       assignment requires: 375 / 768 / 1440.

   Usage:  npm run preview        (in one terminal, serves ./dist on :4173)
           node scripts/capture.mjs
   ============================================================================ */

import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, readFile } from 'node:fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ICONS = resolve(ROOT, 'public/icons');
const SHOTS = resolve(ROOT, 'docs/screenshots/week11');
const BASE = process.env.BASE_URL || 'http://localhost:4173';

/** Render an SVG file to a square PNG of the given size. */
async function rasterise(browser, svgName, pngName, size) {
  const svg = await readFile(resolve(ICONS, svgName), 'utf8');
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  // Inline the SVG at exactly `size` so there is no scaling blur or padding.
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px">
       <div style="width:${size}px;height:${size}px">${svg
         .replace(/width="512"/, `width="${size}"`)
         .replace(/height="512"/, `height="${size}"`)}</div>
     </body>`
  );
  await page.screenshot({ path: resolve(ICONS, pngName), omitBackground: true });
  await page.close();
  console.log(`  icon  ${pngName.padEnd(24)} ${size}x${size}`);
}

/** Sign in through the real login form so the app shell is reachable. */
async function signIn(page) {
  await page.goto(`${BASE}/#/login`);
  await page.getByLabel('Email address').fill('sarah.chen@careconnect.health');
  await page.getByLabel('Password', { exact: true }).fill('demo-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('heading', { level: 1 }).waitFor();
}

async function shoot(browser, { name, width, height = 900, route, prep }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2, // retina-quality images for the Word document
  });
  await signIn(page);
  if (route) {
    await page.goto(`${BASE}/#${route}`);
    await page.waitForTimeout(400);
  }
  if (prep) await prep(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(SHOTS, `${name}.png`), fullPage: false });
  const measured = await page.evaluate(() => window.innerWidth);
  await page.close();
  console.log(`  shot  ${name.padEnd(34)} viewport=${measured}px`);
  if (measured !== width) throw new Error(`viewport drift: wanted ${width}, got ${measured}`);
}

const browser = await chromium.launch();
await mkdir(SHOTS, { recursive: true });

console.log('\nRasterising brand icons from SVG…');
await rasterise(browser, 'icon.svg', 'icon-192.png', 192);
await rasterise(browser, 'icon.svg', 'icon-512.png', 512);
await rasterise(browser, 'icon-maskable.svg', 'icon-maskable-512.png', 512);

console.log('\nCapturing responsive screenshots…');

// --- Section 1: the three required breakpoints -----------------------------
await shoot(browser, { name: '01-desktop-1440-dashboard', width: 1440, height: 900 });
await shoot(browser, { name: '02-tablet-768-dashboard', width: 768, height: 1024 });
await shoot(browser, { name: '03-mobile-375-dashboard', width: 375, height: 812 });

// Login screen at desktop + mobile.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/#/login`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(SHOTS, '04-desktop-1440-login.png') });
  await page.close();
  console.log('  shot  04-desktop-1440-login             viewport=1440px');

  const m = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  await m.goto(`${BASE}/#/login`);
  await m.waitForTimeout(500);
  await m.screenshot({ path: resolve(SHOTS, '05-mobile-375-login.png') });
  await m.close();
  console.log('  shot  05-mobile-375-login              viewport=375px');
}

// --- Section 1: navigation ---------------------------------------------------
await shoot(browser, { name: '06-mobile-375-bottom-nav', width: 375, height: 812, route: '/notifications' });
await shoot(browser, { name: '07-desktop-1440-features', width: 1440, height: 900, route: '/features' });
await shoot(browser, { name: '08-desktop-1440-search', width: 1440, height: 900, route: '/search',
  prep: async (p) => { await p.getByLabel('Search CareConnect').fill('lab'); await p.waitForTimeout(300); } });

// --- Section 2: accessibility evidence ---------------------------------------
// AppLayout deliberately moves focus to the <h1> on every route change. A bare
// blur() is not enough to undo that for screenshot purposes: the browser keeps
// its "sequential focus navigation starting point" at the heading, so the next
// Tab resumes *after* the h1 and skips straight past the skip link. Focusing the
// body element itself resets that starting point to the top of the document, so
// the Tab that follows reproduces a genuine first-Tab-on-page-load.
const resetFocus = (p) => p.evaluate(() => {
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  document.body.removeAttribute('tabindex');
});

// Skip link is visually hidden until focused — Tab once from the top to reveal it.
await shoot(browser, { name: '09-a11y-skip-link-focused', width: 1440, height: 900,
  prep: async (p) => { await resetFocus(p); await p.keyboard.press('Tab'); } });

// Visible focus ring on a sidebar nav link (Tab past the skip link).
await shoot(browser, { name: '10-a11y-focus-ring-nav', width: 1440, height: 900,
  prep: async (p) => { await resetFocus(p); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); } });

await shoot(browser, { name: '11-a11y-settings-toggles', width: 1440, height: 900, route: '/settings' });
await shoot(browser, { name: '12-a11y-profile-form', width: 1440, height: 900, route: '/profile' });

// High-contrast mode — driven through the Settings switch (the keyboard
// shortcut is Ctrl/Cmd+Alt+H, but toggling the real control is better evidence).
// Space is used rather than a click to double as keyboard-operability proof.
await shoot(browser, { name: '13-a11y-high-contrast', width: 1440, height: 900, route: '/settings',
  prep: async (p) => {
    const hc = p.getByRole('switch', { name: 'High contrast mode' });
    await hc.focus();
    await p.keyboard.press('Space');
    await p.waitForTimeout(400);
  } });

await browser.close();
console.log(`\nDone. Screenshots → ${SHOTS}\n`);
