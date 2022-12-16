import { test, expect } from '@playwright/test';

test.describe('Window', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/window');
  });

  test('cy.title() - get the title', async ({ page }) => {
    // https://on.cypress.io/title
    await expect(page).toHaveTitle(/Kitchen Sink/);
  });
});
