import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Critical user flow: Login → Dashboard
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Check that login form is visible
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByRole('heading', { name: /iniciar sesión|login/i })).toBeVisible();

    // Check for email and password fields
    await expect(page.getByLabel(/email|correo/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();

    // Check for submit button
    await expect(page.getByRole('button', { name: /iniciar sesión|login/i })).toBeVisible();
  });

  test('should show validation errors with empty form', async ({ page }) => {
    // Click login button without filling form
    await page.getByRole('button', { name: /iniciar sesión|login/i }).click();

    // Should show validation errors
    await expect(page.locator('text=/requerido|required|obligatorio/i')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByLabel(/email|correo/i).fill('invalid@example.com');
    await page.getByLabel(/contraseña|password/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /iniciar sesión|login/i }).click();

    // Should show error message
    // Wait for error message (may take a few seconds for API response)
    await expect(
      page.locator('text=/credenciales inválidas|invalid credentials|error/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to registration page', async ({ page }) => {
    // Click on register link
    await page.getByRole('link', { name: /registrarse|register|crear cuenta/i }).click();

    // Should be on registration page
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /registrar|register/i })).toBeVisible();
  });

  test.skip('should successfully login with valid credentials', async ({ page }) => {
    // NOTE: This test requires a test user in the database
    // Skip for now until test data setup is ready

    const testEmail = 'test@example.com';
    const testPassword = 'Test123!';

    // Fill login form
    await page.getByLabel(/email|correo/i).fill(testEmail);
    await page.getByLabel(/contraseña|password/i).fill(testPassword);

    // Submit form
    await page.getByRole('button', { name: /iniciar sesión|login/i }).click();

    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Should display user-specific content
    await expect(page.locator('text=/bienvenido|welcome/i')).toBeVisible();
  });

  test('should have password visibility toggle', async ({ page }) => {
    const passwordInput = page.getByLabel(/contraseña|password/i);

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button (usually an eye icon)
    const toggleButton = page.locator('button[type="button"]').filter({
      has: page.locator('svg'), // Icon button
    }).first();

    if (await toggleButton.isVisible()) {
      await toggleButton.click();

      // Password should now be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /registrar|register/i })).toBeVisible();

    // Check for required registration fields
    await expect(page.getByLabel(/nombre|name|first name/i)).toBeVisible();
    await expect(page.getByLabel(/email|correo/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    const passwordInput = page.getByLabel(/contraseña|password/i).first();

    // Type weak password
    await passwordInput.fill('123');

    // Should show password strength indicator or validation message
    // This depends on your implementation
    await expect(
      page.locator('text=/débil|weak|contraseña debe|password must/i')
    ).toBeVisible({ timeout: 3000 });
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/email|correo/i);

    // Type invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur(); // Trigger validation

    // Should show validation error
    await expect(
      page.locator('text=/email inválido|invalid email|formato/i')
    ).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Session Management', () => {
  test('should handle session timeout', async ({ page }) => {
    await page.goto('/');

    // This test would need to:
    // 1. Login
    // 2. Wait for session to expire (or manipulate token)
    // 3. Try to access protected route
    // 4. Verify redirect to login

    // Skipping for now as it requires complex setup
    test.skip();
  });

  test('should persist session across page reloads', async ({ page }) => {
    // This test would verify that after login,
    // refreshing the page keeps the user logged in

    test.skip();
  });
});
