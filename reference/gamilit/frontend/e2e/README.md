# E2E Tests - GAMILIT

End-to-End tests using Playwright for the GAMILIT educational gamification platform.

## 📋 Overview

This directory contains End-to-End (E2E) tests that verify critical user flows and ensure the application works correctly from a user's perspective.

## 🚀 Running Tests

### Run all E2E tests (headless)
```bash
npm run test:e2e
```

### Run with UI (interactive mode)
```bash
npm run test:e2e:ui
```

### Run with browser visible (headed mode)
```bash
npm run test:e2e:headed
```

### Debug mode (step through tests)
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:e2e:report
```

### Run specific test file
```bash
npx playwright test auth.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project="Mobile Chrome"
```

## 📁 Test Files

### `auth.spec.ts`
Authentication and registration flows:
- Login page display
- Form validation
- Invalid credentials handling
- Registration flow
- Password visibility toggle
- Session management

### `navigation.spec.ts`
Basic navigation and routing:
- Homepage loading
- 404 handling
- Protected routes
- Performance checks
- Accessibility basics

### `student-journey.spec.ts`
Complete student user journey:
- Dashboard display
- Module selection
- Exercise flow (start → answer → complete)
- Gamification elements (XP, achievements, leaderboard)
- Progress tracking

## 🎯 Test Status

Most tests are currently **skipped** (marked with `test.skip()`) because they require:
- Test user accounts in database
- Backend API running
- Specific test data setup

### Currently Active Tests:
✅ Login page display
✅ Form validation
✅ Navigation basics
✅ 404 handling
✅ Protected routes redirect
✅ Performance checks

### Tests Requiring Setup:
⏸️ Successful login flow (needs test user)
⏸️ Student dashboard (needs authentication)
⏸️ Exercise flow (needs test data)
⏸️ Gamification features (needs game state)

## 🔧 Configuration

Configuration is in `playwright.config.ts`:
- **Test directory:** `./e2e`
- **Base URL:** `http://localhost:3005`
- **Browsers:** Chromium, Firefox, Mobile Chrome
- **Retries:** 2 (on CI), 0 (local)
- **Reports:** HTML, List, JSON

## 📊 Test Coverage Goals

### Critical Flows (Priority 1) 🔥
- [ ] Authentication (Login/Register)
- [ ] Student: Browse → Start Exercise → Complete
- [ ] Teacher: Create Assignment → View Progress
- [ ] Leaderboard display

### Important Flows (Priority 2) 🟡
- [ ] Profile management
- [ ] Achievement unlock
- [ ] Social features (friends, classrooms)
- [ ] Progress tracking

### Nice to Have (Priority 3) 🟢
- [ ] Settings/preferences
- [ ] Notifications
- [ ] Search functionality
- [ ] Mobile responsiveness

## 🏗️ Test Data Setup (TODO)

To enable all tests, we need:

1. **Database Seeds:**
   - Test student account
   - Test teacher account
   - Sample modules and exercises
   - Sample achievements

2. **Environment:**
   - Backend API running on localhost:3006
   - Frontend dev server on localhost:3005
   - Test database with seed data

3. **Helper Functions:**
   - `setupTestData()` - Create test data
   - `loginAsStudent()` - Authenticate test user
   - `loginAsTeacher()` - Authenticate test user
   - `cleanupTestData()` - Remove test data

## 🎨 Visual Regression Testing

Future enhancement: Add visual regression tests using Playwright's screenshot comparison:

```typescript
test('should match homepage screenshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## 📈 CI/CD Integration

Tests are configured to run in CI with:
- Automatic retries (2 attempts)
- Screenshot on failure
- Video on failure
- HTML report generation

### GitHub Actions Example:
```yaml
- name: Run E2E tests
  run: npm run test:e2e
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 🐛 Debugging Tips

### Test Failing? Try:
1. Run in headed mode: `npm run test:e2e:headed`
2. Run in debug mode: `npm run test:e2e:debug`
3. Check screenshot in `test-results/` directory
4. View video in `test-results/` directory
5. Check console errors in test output

### Common Issues:
- **Timeout errors:** Increase timeout or check if backend is running
- **Element not found:** Check if UI has changed
- **Authentication issues:** Verify test user credentials
- **Flaky tests:** Add explicit waits or check for race conditions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## 🎓 Writing New Tests

### Test Structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/feature');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await page.click('button');
    await expect(page.locator('result')).toBeVisible();
  });
});
```

### Best Practices:
- Use data-testid attributes for stable selectors
- Write descriptive test names
- Keep tests independent
- Clean up test data
- Use Page Object Model for complex flows
- Avoid hard-coded waits (use Playwright's auto-waiting)

## ✅ Definition of Done for E2E Tests

A test is "Done" when:
- [ ] Test written and passing
- [ ] Test is not flaky (runs consistently)
- [ ] Test has meaningful assertions
- [ ] Test cleans up after itself
- [ ] Test is documented (comments if complex)
- [ ] Test runs in CI

---

**Last Updated:** November 9, 2025
**Test Framework:** Playwright v1.40+
**Coverage:** 3 test files, ~20 test cases (12 active, 8 skipped)
