import { test, expect } from '@playwright/test';

test.describe('find* dom-testing-library commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'file://' + process.cwd() + '/data/resources/testing-library/index.html'
    );
  });

  // Test each of the types of queries: LabelText, PlaceholderText, Text, DisplayValue, AltText, Title, Role, TestId

  test('findByLabelText', async ({ page }) => {
    await page.getByLabel('Label 1').click();
    await page.getByLabel('Label 1').fill('Hello Input Labelled By Id');
  });

  test('findAllByLabelText', async ({ page }) => {
    await expect(page.getByLabel(/^Label \d$/)).toHaveCount(2);
  });

  test('findByPlaceholderText', async ({ page }) => {
    await page.getByPlaceholder('Input 1').click();
    await page.getByPlaceholder('Input 1').fill('Hello Placeholder');
  });

  test('findAllByPlaceholderText', async ({ page }) => {
    await expect(page.getByPlaceholder(/^Input \d$/)).toHaveCount(2);
  });

  test('findByText', async ({ page }) => {
    await page.getByText('Button Text 1').click();
    await expect(page.getByText('Button Text 1')).toHaveText(/Button Clicked/);
  });

  test('findAllByText', async ({ page }) => {
    await expect(page.getByText(/^Button Text \d$/)).toHaveCount(2);
    for (const locator of await page.getByText(/^Button Text \d$/).all())
      await locator.click();
    await expect(page.getByText(/^Button Text \d$/)).toHaveText(
      /Button Clicked/
    );
  });

  test('findByDisplayValue', async ({ page }) => {
    await page.FIXME_findByDisplayValue('Display Value 1').click();
    await page.FIXME_findByDisplayValue('Display Value 1').clear();
    await page
      .FIXME_findByDisplayValue('Display Value 1')
      .fill('Some new text');
  });

  test('findAllByDisplayValue', async ({ page }) => {
    await expect(
      page.FIXME_findAllByDisplayValue(/^Display Value \d$/)
    ).toHaveCount(2);
  });

  test('findByAltText', async ({ page }) => {
    await page.getByAltText('Image Alt Text 1').click();
  });

  test('findAllByAltText', async ({ page }) => {
    await expect(page.getByAltText(/^Image Alt Text \d$/)).toHaveCount(2);
  });

  test('findByTitle', async ({ page }) => {
    await page.getByTitle('Title 1').click();
  });

  test('findAllByTitle', async ({ page }) => {
    await expect(page.getByTitle(/^Title \d$/)).toHaveCount(2);
  });

  test('findByRole', async ({ page }) => {
    await page.getByRole('dialog').click();
  });

  test('findAllByRole', async ({ page }) => {
    await expect(page.getByRole(/^dialog/)).toHaveCount(2);
  });

  test('findByTestId', async ({ page }) => {
    await page.getByTestId('image-with-random-alt-tag-1').click();
  });

  test('findAllByTestId', async ({ page }) => {
    await expect(
      page.getByTestId(/^image-with-random-alt-tag-\d$/)
    ).toHaveCount(2);
  });

  /* Test the behaviour around these queries */

  test('findByText should handle non-existence', async ({ page }) => {
    await expect(page.getByText('Does Not Exist')).not.toBeVisible();
  });

  test('findByText should handle eventual existence', async ({ page }) => {
    await expect(page.getByText('Eventually Exists')).toBeVisible();
  });

  test('findByText should handle eventual non-existence', async ({ page }) => {
    await expect(page.getByText('Eventually Not exists')).not.toBeVisible();
  });

  test("findByText with should('not.exist')", async ({ page }) => {
    await expect(page.getByText(/^Button Text \d$/)).toBeVisible();
    await expect(
      page.getByText('Non-existing Button Text', { timeout: 100 })
    ).not.toBeVisible();
  });

  test('findByText with a previous subject', async ({ page }) => {
    await expect(
      page.locator('#nested').getByText('Button Text 1')
    ).not.toBeVisible();
    await expect(
      page.locator('#nested').getByText('Button Text 2')
    ).toBeVisible();
  });

  test('findByText within', async ({ page }) => {
    const scope = page.locator('#nested');
    await expect(scope.getByText('Button Text 1')).not.toBeVisible();
    await expect(scope.getByText('Button Text 2')).toBeVisible();
  });

  test('findByText in container', async ({ page }) => {
    const subject = page.locator('#nested');
    await expect(subject.getByText('Button Text 1')).not.toBeVisible();
    await expect(subject.getByText('Button Text 2')).toBeVisible();
  });

  test('findByText works when another page loads', async ({ page }) => {
    await page.getByText('Next Page').click();
    await expect(page.getByText('New Page Loaded')).toBeVisible();
  });

  test('findByText should set the Cypress element to the found element', async ({
    page,
  }) => {
    // This test is a little strange since snapshots show what element
    // is selected, but snapshots themselves don't give access to those
    // elements. I had to make the implementation specific so that the `$el`
    // is the `subject` when the log is added and the `$el` is the `value`
    // when the log is changed. It would be better to extract the `$el` from
    // each snapshot
    await on(page, 'log:changed', async (attrs, log) => {
      if (log.get('name') === 'findByText') {
        await expect(log.get('$el')).toHaveText('Button Text 1');
      }
    });
  });

  test('findByText should error if no elements are found', async ({ page }) => {
    const regex = /Supercalifragilistic/;
    const errorMessage = `Unable to find an element with the text: /Supercalifragilistic/`;
    await on(page, 'fail', async (err) => {
      expect(err.message).toContain(errorMessage);
    });
  });

  test('findByText should default to Cypress non-existence error message', async ({
    page,
  }) => {
    const errorMessage = `Expected <button> not to exist in the DOM, but it was continuously found.`;
    await on(page, 'fail', async (err) => {
      expect(err.message).toContain(errorMessage);
    });
    await expect(
      page.getByText('Button Text 1', { timeout: 100 })
    ).not.toBeVisible();
  });

  test('findByLabelText should forward useful error messages from @testing-library/dom', async ({
    page,
  }) => {
    const errorMessage = `Found a label with the text of: Label 3, however no form control was found associated to that label.`;
    await on(page, 'fail', async (err) => {
      expect(err.message).toContain(errorMessage);
    });
  });

  test('findByText finding multiple items should error', async ({ page }) => {
    const errorMessage = `Found multiple elements with the text: /^Button Text/i`;
    await on(page, 'fail', async (err) => {
      expect(err.message).toContain(errorMessage);
    });
  });

  test('findByText should show as a parent command if it starts a chain', async ({
    page,
  }) => {
    const assertLog = async (attrs, log) => {
      if (log.get('name') === 'findByText') {
        expect(log.get('type')).toBe('parent');
        await off(page, 'log:added', assertLog);
      }
    };
    await on(page, 'log:added', assertLog);
  });

  test('findByText should show as a child command if it continues a chain', async ({
    page,
  }) => {
    const assertLog = async (attrs, log) => {
      if (log.get('name') === 'findByText') {
        expect(log.get('type')).toBe('child');
        await off(page, 'log:added', assertLog);
      }
    };
    await on(page, 'log:added', assertLog);
  });
});

/* global cy */
