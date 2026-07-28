import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/#/login');
  await page.getByLabel('Email address').fill('user@example.com');
  await page.getByLabel('Password').fill('anypassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/#\/$/);
}

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/#/search');
  });

  test('renders the Search heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Search' })).toBeVisible();
  });

  test('shows the empty state hint by default', async ({ page }) => {
    await expect(page.getByText('Type to search across your portal.')).toBeVisible();
  });

  test('shows results when searching for "lab"', async ({ page }) => {
    await page.getByRole('searchbox').fill('lab');
    await expect(page.getByText(/results? for "lab"/i)).toBeVisible();
  });

  test('shows 0 results for an unmatched query', async ({ page }) => {
    await page.getByRole('searchbox').fill('zzznomatch9999');
    await expect(page.getByText(/0 results/i)).toBeVisible();
  });

  test('shows navigation section when searching for "home"', async ({ page }) => {
    await page.getByRole('searchbox').fill('home');
    await expect(page.getByText('Navigation')).toBeVisible();
  });

  test('result links are keyboard-focusable', async ({ page }) => {
    await page.getByRole('searchbox').fill('lab');
    // Tab from the search input to the first result link
    await page.getByRole('searchbox').press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
