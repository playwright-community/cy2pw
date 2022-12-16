import { test, expect } from '@playwright/test';

test.describe('Traversal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/traversal');
  });

  test('.children() - get child DOM elements', async ({ page }) => {
    // https://on.cypress.io/children
    await expect(
      page.locator('.traversal-breadcrumb').locator('.active')
    ).toHaveText(/Data/);
  });

  test('.eq() - get a DOM element at a specific index', async ({ page }) => {
    // https://on.cypress.io/eq
    await expect(page.locator('.traversal-list>li').nth(1)).toHaveText(
      /siamese/
    );
  });

  test('.filter() - get DOM elements that match the selector', async ({
    page,
  }) => {
    // https://on.cypress.io/filter
    await expect(
      page.locator('.traversal-nav>li').locator('.active:scope')
    ).toHaveText(/About/);
  });

  test('.find() - get descendant DOM elements of the selector', async ({
    page,
  }) => {
    // https://on.cypress.io/find
    await expect(
      page.locator('.traversal-pagination').locator('li').locator('a')
    ).toHaveCount(7);
  });

  test('.first() - get first DOM element', async ({ page }) => {
    // https://on.cypress.io/first
    await expect(page.locator('.traversal-table td').first()).toHaveText(/1/);
  });

  test('.last() - get last DOM element', async ({ page }) => {
    // https://on.cypress.io/last
    await expect(page.locator('.traversal-buttons .btn').last()).toHaveText(
      /Submit/
    );
  });

  test('.parent() - get parent DOM element from DOM elements', async ({
    page,
  }) => {
    // https://on.cypress.io/parent
    await expect(page.locator('.traversal-mark').locator('..')).toHaveText(
      /Morbi leo risus/
    );
  });

  test('.parents() - get parent DOM elements from DOM elements', async ({
    page,
  }) => {
    // https://on.cypress.io/parents
    await expect
      .poll(async () =>
        page
          .locator('*')
          .filter({ has: page.locator('.traversal-cite') })
          .evaluateAll((elements, match) => {
            const matches = new Set(document.querySelectorAll(match));
            return !!elements.find((e) => matches.has(e));
          }, 'blockquote')
      )
      .toBeTruthy();
  });
});
