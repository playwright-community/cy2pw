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

  test('.closest() - get closest ancestor DOM element', async ({ page }) => {
    // https://on.cypress.io/closest
    await expect(
      page.locator('.traversal-badge').FIXME_closest('ul')
    ).toHaveClass(/list-group/);
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

  test('.next() - get next sibling DOM element', async ({ page }) => {
    // https://on.cypress.io/next
    await expect(
      page
        .locator('.traversal-ul')
        .getByText(/apples/)
        .first()
        .FIXME_next()
    ).toHaveText(/oranges/);
  });

  test('.nextAll() - get all next sibling DOM elements', async ({ page }) => {
    // https://on.cypress.io/nextall
    await expect(
      page
        .locator('.traversal-next-all')
        .getByText(/oranges/)
        .first()
        .FIXME_nextAll()
    ).toHaveCount(3);
  });

  test('.nextUntil() - get next sibling DOM elements until next el', async ({
    page,
  }) => {
    // https://on.cypress.io/nextuntil
    await expect(page.locator('#veggies').FIXME_nextUntil('#nuts')).toHaveCount(
      3
    );
  });

  test('.not() - remove DOM elements from set of DOM elements', async ({
    page,
  }) => {
    // https://on.cypress.io/not
    await expect(
      page.locator('.traversal-disabled .btn').locator(':scope:not([disabled])')
    ).not.toHaveText(/Disabled/);
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

  test('.parentsUntil() - get parent DOM elements from DOM elements until el', async ({
    page,
  }) => {
    // https://on.cypress.io/parentsuntil
    await expect(
      page
        .locator('.clothes-nav *')
        .filter({ has: page.locator('.clothes-nav').locator('.active') })
    ).toHaveCount(2);
  });

  test('.prev() - get previous sibling DOM element', async ({ page }) => {
    // https://on.cypress.io/prev
    await expect(
      page.locator('.birds').locator('.active').FIXME_prev()
    ).toHaveText(/Lorikeets/);
  });

  test('.prevAll() - get all previous sibling DOM elements', async ({
    page,
  }) => {
    // https://on.cypress.io/prevall
    await expect(
      page.locator('.fruits-list').locator('.third').FIXME_prevAll()
    ).toHaveCount(2);
  });

  test('.prevUntil() - get all previous sibling DOM elements until el', async ({
    page,
  }) => {
    // https://on.cypress.io/prevuntil
    await expect(
      page.locator('.foods-list').locator('#nuts').FIXME_prevUntil('#veggies')
    ).toHaveCount(3);
  });

  test('.siblings() - get all sibling DOM elements', async ({ page }) => {
    // https://on.cypress.io/siblings
    await expect(
      page.locator('.traversal-pills .active').FIXME_siblings()
    ).toHaveCount(2);
  });
});
