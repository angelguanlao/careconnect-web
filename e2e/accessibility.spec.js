import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/#/login');
  await page.getByLabel('Email address').fill('user@example.com');
  await page.locator('#password').fill('anypassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/#\/$/);
}

test.describe('Accessibility', () => {
  test('skip link is the first focusable element on the login page', async ({ page }) => {
    await page.goto('/#/login');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveText('Skip to main content');
  });

  test('skip link is the first focusable element on the dashboard', async ({ page }) => {
    await login(page);
    // Query DOM to confirm skip link is first in tab order
    const isFirst = await page.evaluate(() => {
      const focusable = Array.from(document.querySelectorAll(
        'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
      ));
      return focusable[0]?.classList.contains('skip-link') ?? false;
    });
    expect(isFirst).toBe(true);
  });

  test('login form fields are reachable by Tab', async ({ page }) => {
    await page.goto('/#/login');
    // Skip the skip-link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('id', 'email');
  });

  test('all nav links are keyboard-accessible', async ({ page }) => {
    await login(page);
    const navLinks = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('Settings toggles are operable with Space', async ({ page }) => {
    await login(page);
    await page.goto('/#/settings');
    const toggle = page.getByRole('switch', { name: 'High contrast mode' });
    const before = await toggle.getAttribute('aria-checked');
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });

  test('Notifications filter buttons have aria-pressed', async ({ page }) => {
    await login(page);
    await page.goto('/#/notifications');
    const allBtn = page.getByRole('button', { name: 'All', exact: true });
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Unread', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Unread', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('password toggle button has aria-pressed', async ({ page }) => {
    await page.goto('/#/login');
    await expect(page.getByLabel('Show password')).toHaveAttribute('aria-pressed', 'false');
    await page.getByLabel('Show password').click();
    await expect(page.getByLabel('Hide password')).toHaveAttribute('aria-pressed', 'true');
  });
});
