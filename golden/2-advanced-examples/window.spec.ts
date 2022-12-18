import { test, expect } from '@playwright/test';

test.describe('Window', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/window');
  });

  test('cy.window() - get the global window object', async ({ page }) => {
    // https://on.cypress.io/window
    expect(await page.evaluateHandle('window')).toHaveProperty('top');
  });

  test('cy.document() - get the document object', async ({ page }) => {
    // https://on.cypress.io/document
    page.FIXME_document();
    expect(page).toHaveProperty('charset');
    expect(page).toBe('UTF-8');
  });

  test('cy.title() - get the title', async ({ page }) => {
    // https://on.cypress.io/title
    await expect(page).toHaveTitle(/Kitchen Sink/);
  });
});
