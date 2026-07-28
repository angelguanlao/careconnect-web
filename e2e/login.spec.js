import { test, expect } from '@playwright/test';

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
  });

  test('shows the Sign in heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.getByLabel('Email address').fill('notanemail');
    await page.getByLabel('Password').fill('pw');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toContainText('Enter a valid email address.');
  });

  test('shows error for empty password', async ({ page }) => {
    await page.getByLabel('Email address').fill('user@example.com');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toContainText('Password is required.');
  });

  test('navigates to dashboard on valid credentials', async ({ page }) => {
    await page.getByLabel('Email address').fill('user@example.com');
    await page.getByLabel('Password').fill('anypassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Good');
  });

  test('toggle shows and hides password', async ({ page }) => {
    const pw = page.getByLabel('Password');
    await expect(pw).toHaveAttribute('type', 'password');
    await page.getByLabel('Show password').click();
    await expect(pw).toHaveAttribute('type', 'text');
    await page.getByLabel('Hide password').click();
    await expect(pw).toHaveAttribute('type', 'password');
  });
});
