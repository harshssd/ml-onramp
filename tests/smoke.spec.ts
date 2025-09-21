import { test, expect } from '@playwright/test';

test.describe('ML Onramp Smoke Tests', () => {
  test('homepage loads and shows correct content', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main heading is visible
    await expect(page.getByRole('heading', { name: 'ML Onramp' })).toBeVisible();
    
    // Check that the description is visible
    await expect(page.getByText('Learn machine learning through interactive lessons')).toBeVisible();
    
    // Check that the Get Started button is visible and clickable
    const getStartedButton = page.getByRole('link', { name: 'Get Started' });
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toHaveAttribute('href', '/signup');
    
    // Check that the Sign In button is visible and clickable
    const signInButton = page.getByRole('link', { name: 'Sign In' });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toHaveAttribute('href', '/login');
  });

  test('login page loads and shows auth form', async ({ page }) => {
    await page.goto('/login');
    
    // Check that the page title is visible
    await expect(page.getByRole('heading', { name: 'ML Onramp' })).toBeVisible();
    
    // Check that the auth form is visible
    await expect(page.getByText('Sign In')).toBeVisible();
    await expect(page.getByText('Enter your credentials to access your account')).toBeVisible();
    
    // Check that form fields are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check that the sign up link is present
    await expect(page.getByRole('link', { name: 'Sign up here' })).toBeVisible();
  });

  test('signup page loads and shows auth form', async ({ page }) => {
    await page.goto('/signup');
    
    // Check that the page title is visible
    await expect(page.getByRole('heading', { name: 'ML Onramp' })).toBeVisible();
    
    // Check that the auth form is visible
    await expect(page.getByText('Create Account')).toBeVisible();
    await expect(page.getByText('Create a new account to get started')).toBeVisible();
    
    // Check that form fields are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check that the sign in link is present
    await expect(page.getByRole('link', { name: 'Sign in here' })).toBeVisible();
  });

  test('app page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/app');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('lesson page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/lesson/test-lesson');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('navigation between auth pages works', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    
    // Click sign up link
    await page.getByRole('link', { name: 'Sign up here' }).click();
    await expect(page).toHaveURL('/signup');
    
    // Click sign in link
    await page.getByRole('link', { name: 'Sign in here' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that content is still visible on mobile
    await expect(page.getByRole('heading', { name: 'ML Onramp' })).toBeVisible();
    await expect(page.getByText('Learn machine learning through interactive lessons')).toBeVisible();
    
    // Check that buttons are still clickable
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });
});
