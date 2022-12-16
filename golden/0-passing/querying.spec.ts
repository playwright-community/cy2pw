import { test, expect } from '@playwright/test';

test.describe('Querying', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/querying');
  });

  // The most commonly used query is 'cy.get()', you can
  // think of this like the '$' in jQuery

  test('cy.get() - query DOM elements', async ({ page }) => {
    // https://on.cypress.io/get
    await expect(page.locator('#query-btn')).toHaveText(/Button/);
    await expect(page.locator('.query-btn')).toHaveText(/Button/);
    await expect(page.locator('#querying .well>button').first()).toHaveText(
      /Button/
    );
    //              ↲
    // Use CSS selectors just like jQuery
    await expect(page.locator('[data-test-id="test-example"]')).toHaveClass(
      /example/
    );

    // 'cy.get()' yields jQuery object, you can get its attribute
    // by invoking `.attr()` method
    await expect(page.locator('[data-test-id="test-example"]')).toHaveAttribute(
      'data-test-id',
      'test-example'
    );

    // or you can get element's CSS property
    await expect(page.locator('[data-test-id="test-example"]')).toHaveCSS(
      'position',
      'static'
    );

    // or use assertions directly during 'cy.get()'
    // https://on.cypress.io/assertions
    await expect(page.locator('[data-test-id="test-example"]')).toHaveAttribute(
      'data-test-id',
      'test-example'
    );
    await expect(page.locator('[data-test-id="test-example"]')).toHaveCSS(
      'position',
      'static'
    );
  });

  test('cy.contains() - query DOM elements with matching content', async ({
    page,
  }) => {
    // https://on.cypress.io/contains
    await expect(
      page
        .locator('.query-list')
        .getByText(/bananas/)
        .first()
    ).toHaveClass(/third/);

    // we can pass a regexp to `.contains()`
    await expect(
      page.locator('.query-list').getByText(/^b\w+/).first()
    ).toHaveClass(/third/);
    await expect(
      page
        .locator('.query-list')
        .getByText(/apples/)
        .first()
    ).toHaveClass(/first/);

    // passing a selector to contains will
    // yield the selector containing the text
    await expect(
      page
        .locator('#querying')
        .locator('ul', { hasText: /oranges/ })
        .first()
    ).toHaveClass(/query-list/);
  });

  test('.within() - query DOM elements within a specific element', async ({
    page,
  }) => {
    // https://on.cypress.io/within
    const scope = page.locator('.query-form');
    await expect(scope.locator('input').first()).toHaveAttribute(
      'placeholder',
      'Email'
    );
    await expect(scope.locator('input').last()).toHaveAttribute(
      'placeholder',
      'Password'
    );
  });

  test('cy.root() - query the root DOM element', async ({ page }) => {
    // https://on.cypress.io/root

    // By default, root is the document
    await expect
      .poll(async () =>
        page.locator(':root').evaluateAll((elements, match) => {
          const matches = new Set(document.querySelectorAll(match));
          return !!elements.find((e) => matches.has(e));
        }, 'html')
      )
      .toBeTruthy();
    const scope = page.locator('.query-ul');
    // In this within, the root is now the ul DOM element
    await expect(scope).toHaveClass(/query-ul/);
  });

  test('best practices - selecting elements', async ({ page }) => {
    // https://on.cypress.io/best-practices#Selecting-Elements
    const scope = page.locator('[data-cy=best-practices-selecting-elements]');
    // Worst - too generic, no context
    await scope.locator('button').click();

    // Bad. Coupled to styling. Highly subject to change.
    await scope.locator('.btn.btn-large').click();

    // Average. Coupled to the `name` attribute which has HTML semantics.
    await scope.locator('[name=submission]').click();

    // Better. But still coupled to styling or JS event listeners.
    await scope.locator('#main').click();

    // Slightly better. Uses an ID but also ensures the element
    // has an ARIA role attribute
    await scope.locator('#main[role=button]').click();

    // Much better. But still coupled to text content that may change.
    await scope
      .getByText(/Submit/)
      .first()
      .click();

    // Best. Insulated from all changes.
    await scope.locator('[data-cy=submit]').click();
  });
});
