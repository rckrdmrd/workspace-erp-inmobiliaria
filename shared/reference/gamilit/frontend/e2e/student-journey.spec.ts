import { test, expect } from '@playwright/test';

/**
 * Student Journey E2E Tests
 *
 * Critical user flow: Login → Dashboard → Browse Modules → Start Exercise → Complete → Earn Rewards
 */

test.describe('Student Dashboard', () => {
  test.skip('should display student dashboard after login', async ({ page }) => {
    // NOTE: Requires test user setup
    // Login as student user
    // await loginAsStudent(page);

    // Should see dashboard
    await expect(page).toHaveURL(/\/student\/dashboard/);

    // Dashboard should have key sections
    await expect(page.locator('text=/progreso|progress/i')).toBeVisible();
    await expect(page.locator('text=/módulos|modules/i')).toBeVisible();
  });

  test.skip('should display user stats on dashboard', async ({ page }) => {
    // Login as student
    // await loginAsStudent(page);

    // Should show XP
    await expect(page.locator('text=/XP|experiencia/i')).toBeVisible();

    // Should show level
    await expect(page.locator('text=/nivel|level|rango/i')).toBeVisible();

    // Should show progress indicators
    const progressBars = await page.locator('[role="progressbar"], progress, .progress').count();
    expect(progressBars).toBeGreaterThan(0);
  });
});

test.describe('Module Selection', () => {
  test.skip('should display available modules', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/modules');

    // Should show list of modules
    const modules = await page.locator('[data-testid="module-card"], .module-card, article').count();
    expect(modules).toBeGreaterThan(0);

    // Each module should have:
    // - Title
    // - Description or preview
    // - Start/Continue button
  });

  test.skip('should show module difficulty levels', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/modules');

    // Should display difficulty indicators
    const hasDifficulty =
      (await page.locator('text=/fácil|easy|básico/i').count()) > 0 ||
      (await page.locator('text=/intermedio|medium/i').count()) > 0 ||
      (await page.locator('text=/difícil|hard|avanzado/i').count()) > 0;

    expect(hasDifficulty).toBeTruthy();
  });

  test.skip('should allow filtering modules', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/modules');

    // Look for filter controls
    const hasFilters =
      (await page.locator('select, [role="combobox"]').count()) > 0 ||
      (await page.locator('button:has-text("Filtrar"), button:has-text("Filter")').count()) > 0;

    expect(hasFilters).toBeTruthy();
  });
});

test.describe('Exercise Flow', () => {
  test.skip('should start an exercise', async ({ page }) => {
    // await loginAsStudent(page);
    // await navigateToModule(page);

    // Click start exercise button
    await page.getByRole('button', { name: /iniciar|start|comenzar/i }).first().click();

    // Should navigate to exercise page
    await expect(page).toHaveURL(/\/exercise|\/ejercicio/);

    // Should show exercise content
    await expect(page.locator('[data-testid="exercise-content"], .exercise-content')).toBeVisible();
  });

  test.skip('should display exercise question', async ({ page }) => {
    // await loginAsStudent(page);
    // await startExercise(page);

    // Should show question text
    const hasQuestion =
      (await page.locator('[data-testid="question"], .question, h2, h3').count()) > 0;

    expect(hasQuestion).toBeTruthy();

    // Should show options (for multiple choice)
    const options = await page.locator('input[type="radio"], button[role="radio"]').count();
    expect(options).toBeGreaterThanOrEqual(2); // At least 2 options
  });

  test.skip('should allow answer selection', async ({ page }) => {
    // await loginAsStudent(page);
    // await startExercise(page);

    // Select an option
    const firstOption = page.locator('input[type="radio"], button[role="radio"]').first();
    await firstOption.click();

    // Option should be selected
    await expect(firstOption).toBeChecked();

    // Submit button should be enabled
    const submitButton = page.getByRole('button', { name: /enviar|submit|confirmar/i });
    await expect(submitButton).toBeEnabled();
  });

  test.skip('should submit answer and show feedback', async ({ page }) => {
    // await loginAsStudent(page);
    // await startExercise(page);

    // Select answer
    await page.locator('input[type="radio"], button[role="radio"]').first().click();

    // Submit
    await page.getByRole('button', { name: /enviar|submit/i }).click();

    // Should show feedback
    await expect(
      page.locator('text=/correcto|correct|incorrecto|incorrect|bien|mal/i')
    ).toBeVisible({ timeout: 5000 });

    // Should show continue/next button
    await expect(page.getByRole('button', { name: /siguiente|next|continuar/i })).toBeVisible();
  });

  test.skip('should track exercise progress', async ({ page }) => {
    // await loginAsStudent(page);
    // await startExercise(page);

    // Should show progress indicator (e.g., "Question 1 of 10")
    const hasProgress =
      (await page.locator('text=/\\d+ de \\d+|\\d+ of \\d+/i').count()) > 0 ||
      (await page.locator('[role="progressbar"]').count()) > 0;

    expect(hasProgress).toBeTruthy();
  });

  test.skip('should complete exercise and show results', async ({ page }) => {
    // await loginAsStudent(page);
    // await completeExercise(page);

    // Should show completion screen
    await expect(
      page.locator('text=/completado|completed|finalizado|terminado/i')
    ).toBeVisible();

    // Should show score
    await expect(page.locator('text=/puntuación|score|resultado/i')).toBeVisible();

    // Should show XP earned
    await expect(page.locator('text=/XP|experiencia ganada/i')).toBeVisible();
  });
});

test.describe('Gamification Elements', () => {
  test.skip('should display XP gain animation', async ({ page }) => {
    // await loginAsStudent(page);
    // await completeExercise(page);

    // Should show XP animation or notification
    // This might be a toast, modal, or animated number
    const hasXPNotification =
      (await page.locator('[data-testid="xp-notification"], .xp-earned, .toast').count()) > 0;

    expect(hasXPNotification).toBeTruthy();
  });

  test.skip('should show achievement unlock', async ({ page }) => {
    // NOTE: This would require completing specific conditions
    // to unlock an achievement

    // await loginAsStudent(page);
    // await performActionThatUnlocksAchievement(page);

    // Should show achievement modal/notification
    await expect(page.locator('text=/logro|achievement|desbloquear/i')).toBeVisible({
      timeout: 10000,
    });
  });

  test.skip('should display leaderboard', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/leaderboard');

    // Should show leaderboard table
    await expect(page.locator('table, [role="table"]')).toBeVisible();

    // Should have columns: Rank, Name, XP, Level
    await expect(page.locator('text=/rango|rank|posición/i')).toBeVisible();
    await expect(page.locator('text=/nombre|name|usuario/i')).toBeVisible();
    await expect(page.locator('text=/XP|puntos/i')).toBeVisible();
  });

  test.skip('should highlight current user in leaderboard', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/leaderboard');

    // Current user row should be highlighted
    const highlightedRow = page.locator('[data-testid="current-user-row"], .current-user, .highlight');

    await expect(highlightedRow).toBeVisible();
  });
});

test.describe('Progress Tracking', () => {
  test.skip('should show module completion status', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/progress');

    // Should show completed modules
    const completedModules = await page.locator('text=/completado|completed|✓/i').count();

    // Should show in-progress modules
    const inProgressModules = await page.locator('text=/en progreso|in progress/i').count();

    // Should have at least one status shown
    expect(completedModules + inProgressModules).toBeGreaterThan(0);
  });

  test.skip('should display overall progress percentage', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/progress');

    // Should show percentage (e.g., "75% completed")
    const hasPercentage = await page.locator('text=/\\d+%/').count();
    expect(hasPercentage).toBeGreaterThan(0);
  });

  test.skip('should show recent activity', async ({ page }) => {
    // await loginAsStudent(page);
    await page.goto('/student/dashboard');

    // Should show recent activity section
    await expect(page.locator('text=/actividad reciente|recent activity/i')).toBeVisible();

    // Should list recent exercises or modules
    const activityItems = await page.locator('[data-testid="activity-item"], .activity-item, li').count();
    expect(activityItems).toBeGreaterThan(0);
  });
});

/**
 * Helper functions (to be implemented with actual test data)
 */

async function loginAsStudent(page: any) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('student@test.com');
  await page.getByLabel(/password/i).fill('Test123!');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL(/\/student\/dashboard/);
}

async function navigateToModule(page: any) {
  await page.goto('/student/modules');
  await page.locator('[data-testid="module-card"]').first().click();
}

async function startExercise(page: any) {
  await navigateToModule(page);
  await page.getByRole('button', { name: /start/i }).click();
}

async function completeExercise(page: any) {
  await startExercise(page);

  // Answer all questions (simplified - assumes 5 questions)
  for (let i = 0; i < 5; i++) {
    await page.locator('input[type="radio"]').first().click();
    await page.getByRole('button', { name: /submit|next/i }).click();
    await page.waitForTimeout(500);
  }
}
