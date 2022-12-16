import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io');
    await page
      .locator('.navbar-nav')
      .getByText(/Commands/)
      .first()
      .click();
    await page
      .locator('.dropdown-menu')
      .getByText(/Navigation/)
      .first()
      .click();
  });

  test("cy.go() - go back or forward in the browser's history", async ({
    page,
  }) => {
    // https://on.cypress.io/go
    await expect(page).toHaveURL(/\/navigation/);
    await page.goBack();
    await expect(page).not.toHaveURL(/\/navigation/);
    await page.goForward();
    await expect(page).toHaveURL(/\/navigation/);

    // clicking back
    await page.goBack();
    await expect(page).not.toHaveURL(/\/navigation/);

    // clicking forward
    await page.goForward();
    await expect(page).toHaveURL(/\/navigation/);
  });

  test('cy.reload() - reload the page', async ({ page }) => {
    // https://on.cypress.io/reload
    await page.reload();

    // reload the page without using the cache
    await page.reload();
  });

  test('cy.visit() - visit a remote url', async ({ page }) => {
    // https://on.cypress.io/visit

    // Visit any sub-domain of your current domain

    /* eslint-disable no-unused-vars */
    // Pass options to the visit
    await page.addInitScript(async () => {
      const contentWindow = window;
      // contentWindow is the remote page's window object
      expect(typeof contentWindow === 'object').toBeTruthy();
    });
    await page.goto('https://example.cypress.io/commands/navigation', {
      timeout: 50000,
    });
    await page.evaluate(async () => {
      const contentWindow = window;
      // contentWindow is the remote page's window object
      expect(typeof contentWindow === 'object').toBeTruthy();
    });

    /* eslint-enable no-unused-vars */
  });
});
