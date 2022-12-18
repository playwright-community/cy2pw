import { test, expect } from '@playwright/test';

test.describe('Aliasing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/aliasing');
  });

  test('.as() - alias a DOM element for later use', async ({ page }) => {
    // https://on.cypress.io/as

    // Alias a DOM element for use later
    // We don't have to traverse to the element
    // later in our code, we reference it with @
    const firstBtn = page
      .locator('.as-table')
      .locator('tbody>tr')
      .first()
      .locator('td')
      .first()
      .locator('button');

    // when we reference the alias, we place an
    // @ in front of its name
    await firstBtn.click();
    await expect(firstBtn).toHaveClass(/btn-success/);
    await expect(firstBtn).toHaveText(/Changed/);
  });

  test('.as() - alias a route for later use', async ({ page }) => {
    // Alias the route to wait for its response
    const getComment = page.waitForResponse('**/comments/*');

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    await page.locator('.network-btn').click();

    // https://on.cypress.io/wait
    expect((await getComment).status()).toBe(200);
  });
});
