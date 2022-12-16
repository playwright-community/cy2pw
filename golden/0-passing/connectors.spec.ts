import { test, expect } from '@playwright/test';

test.describe('Connectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/connectors');
  });

  test.describe('.then()', () => {
    test('invokes a callback function with the current subject', async ({
      page,
    }) => {
      // https://on.cypress.io/then
      const $lis = page.locator('.connectors-list > li');
      await expect($lis).toHaveCount(3);
      await expect($lis.nth(0)).toHaveText('Walk the dog');
      await expect($lis.nth(1)).toHaveText('Feed the cat');
      await expect($lis.nth(2)).toHaveText('Write JavaScript');
    });
  });
});
