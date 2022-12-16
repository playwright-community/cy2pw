import { test, expect } from '@playwright/test';

test.describe('Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/assertions');
  });

  test.describe('Implicit Assertions', () => {
    test('.should() - make an assertion about the current subject', async ({
      page,
    }) => {
      // https://on.cypress.io/should
      await expect(
        page.locator('.assertion-table').locator('tbody tr').last()
      ).toHaveClass(/success/);
      await expect(
        page
          .locator('.assertion-table')
          .locator('tbody tr')
          .last()
          .locator('td')
          .first()
      ).toHaveText('Column content');
      await expect(
        page
          .locator('.assertion-table')
          .locator('tbody tr')
          .last()
          .locator('td')
          .first()
      ).toHaveText(/Column content/);
      await expect
        .poll(async () =>
          page
            .locator('.assertion-table')
            .locator('tbody tr')
            .last()
            .locator('td')
            .first()
            .evaluate((element) => element.outerHTML)
        )
        .toContain('Column content');
      await expect
        .poll(async () =>
          page
            .locator('.assertion-table')
            .locator('tbody tr')
            .last()
            .locator('td')
            .first()
            .evaluateAll(
              (elements, match) => {
                const matches = new Set(document.querySelectorAll(match));
                return !!elements.find((e) => matches.has(e));
              },

              'td'
            )
        )
        .toBeTruthy();
      await expect(
        page
          .locator('.assertion-table')
          .locator('tbody tr')
          .last()
          .locator('td')
          .first()
      ).toHaveText(/column content/i);

      // a better way to check element's text content against a regular expression
      // is to use "cy.contains"
      // https://on.cypress.io/contains
      await expect(
        page
          .locator('.assertion-table')
          .locator('tbody tr')
          .last()
          .locator('td', { hasText: /column content/i })
          .first()
      ).toBeVisible();

      // for more information about asserting element's text
      // see https://on.cypress.io/using-cypress-faq#How-do-I-get-an-element’s-text-contents
    });

    test('.and() - chain multiple assertions together', async ({ page }) => {
      // https://on.cypress.io/and
      await expect(page.locator('.assertions-link')).toHaveClass(/active/);
      await expect(page.locator('.assertions-link')).toHaveAttribute(
        'href',
        /cypress\.io/
      );
    });
  });

  test.describe('Explicit Assertions', () => {
    // https://on.cypress.io/assertions
    test('expect - make an assertion about a specified subject', async ({
      page,
    }) => {
      // We can use Chai's BDD style assertions
      expect(true).toBeTruthy();
      const o = { foo: 'bar' };
      expect(o).toBe(o);
      expect(o).toEqual({ foo: 'bar' });
      // matching text using regular expression
      expect('FooBar').toMatch(/bar$/i);
    });

    test('pass your own callback function to should()', async ({ page }) => {
      // Pass a function to should that can have any number
      // of explicit assertions within it.
      // The ".should(cb)" function will be retried
      // automatically until it passes all your explicit assertions or times out.
      await expect(async () => {
        const $p = page.locator('.assertions-p').locator('p');

        // https://on.cypress.io/$
        // return an array of texts from all of the p's
        const texts = (async () => {
          $p.FIXME_map((i, el) => Cypress.$(el).text());
          return $p;
        })();

        // jquery map returns jquery object
        // and .get() convert this to simple array
        const paragraphs = texts.get();

        // array should have length of 3
        await expect(paragraphs).toHaveCount(3);

        // use second argument to expect(...) to provide clear
        // message with each assertion
        expect(paragraphs).toEqual([
          'Some text from first p',
          'More text from second p',
          'And even more text from third p',
        ]);
      }).toPass();
    });

    test('finds element by class name regex', async ({ page }) => {
      await expect(async () => {
        const $div = page.locator('.docs-header').locator('div');
        await expect($div).toHaveCount(1);

        const className = $div[0].className;
        expect(className).toMatch(/heading-/);
      }).toPass();
      {
        const $div = page.locator('.docs-header').locator('div');
        await expect($div).toHaveText('Introduction');
      }
    });

    test('can throw any error', async ({ page }) => {
      await expect(async () => {
        const $div = page.locator('.docs-header').locator('div');

        if ($div.length !== 1) {
          // you can throw your own errors
          throw new Error('Did not find 1 element');
        }

        const className = $div[0].className;

        if (!className.match(/heading-/)) {
          throw new Error(`Could not find class "heading-" in ${className}`);
        }
      }).toPass();
    });

    test('matches unknown text between two elements', async ({ page }) => {
      /**
       * Text from the first element.
       * @type {string}
       */
      let text;

      /**
       * Normalizes passed text,
       * useful before comparing text with spaces and different capitalization.
       * @param {string} s Text to normalize
       */
      const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase();
      const $first = page.locator('.two-elements').locator('.first');

      // save text from the first element
      text = normalizeText(await $first.textContent());
      await expect(async () => {
        const $div = page.locator('.two-elements').locator('.second');

        // we can massage text before comparing
        const secondText = normalizeText(await $div.textContent());
        expect(secondText).toBe(text);
      }).toPass();
    });

    test('assert - assert shape of an object', async ({ page }) => {
      const person = {
        name: 'Joe',
        age: 20,
      };

      assert.isObject(person, 'value is object');
    });

    test('retries the should callback until assertions pass', async ({
      page,
    }) => {
      await expect(async () => {
        const $div = page.locator('#random-number');

        const n = parseFloat(await $div.textContent());
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(10);
      }).toPass();
    });
  });
});
