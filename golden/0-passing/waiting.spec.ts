import { test, expect } from '@playwright/test';

test.describe('Waiting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/waiting');
  });
  // BE CAREFUL of adding unnecessary wait times.
  // https://on.cypress.io/best-practices#Unnecessary-Waiting

  // https://on.cypress.io/wait
  test('cy.wait() - wait for a specific amount of time', async ({ page }) => {
    await page.locator('.wait-input1').fill('Wait 1000ms after typing');
    await page.waitForTimeout(1000);
    await page.locator('.wait-input2').fill('Wait 1000ms after typing');
    await page.waitForTimeout(1000);
    await page.locator('.wait-input3').fill('Wait 1000ms after typing');
    await page.waitForTimeout(1000);
  });

  test('cy.wait() - wait for a specific route', async ({ page }) => {
    // Listen to GET to comments/1
    const getComment = page.waitForResponse('**/comments/*');

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    await page.locator('.network-btn').click();

    // wait for GET comments/1
    expect((await getComment).status()).toBe(200);
  });
});
