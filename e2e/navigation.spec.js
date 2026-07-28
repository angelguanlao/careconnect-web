import { test, expect } from '@playwright/test';

// Helper: sign in before navigation tests.
async function login(page) {
  await page.goto('/#/login');
  await page.getByLabel('Email address').fill('user@example.com');
  await page.getByLabel('Password').fill('anypassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/#\/$/);
}

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => login(page));

  test('unauthenticated visit to / redirects to /login', async ({ page }) => {
    // Open a fresh context so there is no session
    await page.goto('/');
    await expect(page).toHaveURL(/#\/login/);
  });

  test('sidebar shows all nav items', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Features/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Alerts/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Profile/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Settings/i })).toBeVisible();
  });

  test('clicking Alerts nav link loads Notifications page', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Alerts/i }).click();
    await expect(page).toHaveURL(/#\/notifications/);
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });

  test('clicking Features nav link loads Features page', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Features/i }).click();
    await expect(page).toHaveURL(/#\/features/);
    await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible();
  });

  test('clicking Profile nav link loads Profile page', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Profile/i }).click();
    await expect(page).toHaveURL(/#\/profile/);
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('clicking Settings nav link loads Settings page', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: /Settings/i }).click();
    await expect(page).toHaveURL(/#\/settings/);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('sign out returns to login page', async ({ page }) => {
    await page.goto('/#/settings');
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/#\/login/);
  });
});
