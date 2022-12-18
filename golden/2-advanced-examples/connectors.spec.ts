import { test, expect } from '@playwright/test';

test.describe('Connectors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/connectors');
  });

  test('.each() - iterate over an array of elements', async ({ page }) => {
    // https://on.cypress.io/each
    page.locator('.connectors-each-ul>li').FIXME_each(($el, index, $list) => {
      // eslint-disable-next-line no-console
      console.log($el, index, $list);
    });
  });

  test('.its() - get properties on the current subject', async ({ page }) => {
    // https://on.cypress.io/its
    await expect
      .poll(async () => page.locator('.connectors-its-ul>li').count())
      .toBeGreaterThan(2);
  });

  test('.invoke() - invoke a function on the current subject', async ({
    page,
  }) => {
    // our div is hidden in our script.js
    // $('.connectors-div').hide()

    // https://on.cypress.io/invoke
    await expect(page.locator('.connectors-div')).toBeHidden();
    await page
      .locator('.connectors-div')
      .FIXME_should('invoke.show.be.visible');
  });

  test('.spread() - spread an array as individual args to callback function', async ({
    page,
  }) => {
    // https://on.cypress.io/spread
    const arr = ['foo', 'bar', 'baz'];
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

    test('yields the returned value to the next command', async ({ page }) => {
      const num = 1;
      expect(num).toBe(1);

      return 2;
      {
        const num = 1;
        expect(num).toBe(2);
      }
    });

    test('yields the original subject without return', async ({ page }) => {
      const num = 1;
      expect(num).toBe(1);
      // note that nothing is returned from this callback
      {
        const num = 1;

        // this callback receives the original unchanged value 1
        expect(num).toBe(1);
      }
    });

    test('yields the value yielded by the last Cypress command inside', async ({
      page,
    }) => {
      const num = 1;
      expect(num).toBe(1);
      // note how we run a Cypress command
      // the result yielded by this Cypress command
      // will be passed to the second ".then"
      {
        const num = 1;

        // this callback receives the value yielded by "cy.wrap(2)"
        expect(num).toBe(2);
      }
    });
  });
});
