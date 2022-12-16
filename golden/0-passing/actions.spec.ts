import { test, expect } from '@playwright/test';

test.describe('Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/actions');
  });

  // https://on.cypress.io/interacting-with-elements

  test('.type() - type into a DOM element', async ({ page }) => {
    // https://on.cypress.io/type
    await page.locator('.action-email').fill('fake@email.com');
    await expect(page.locator('.action-email')).toHaveValue('fake@email.com');
    await page.locator('.action-email').press('ArrowLeft');
    await page.locator('.action-email').press('ArrowRight');
    await page.locator('.action-email').press('ArrowUp');
    await page.locator('.action-email').press('ArrowDown');
    await page.locator('.action-email').press('Delete');
    await page
      .locator('.action-email')
      .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
    await page.locator('.action-email').press('Backspace');
    await page
      .locator('.action-email')
      .type('slow.typing@email.com', { delay: 100 });
    await expect(page.locator('.action-email')).toHaveValue(
      'slow.typing@email.com'
    );
  });

  test('.type() - type into a DOM element slowly', async ({ page }) => {
    // https://on.cypress.io/type
    await page
      .locator('.action-email')
      .type('slow.typing@email.com', { delay: 100 });
    await expect(page.locator('.action-email')).toHaveValue(
      'slow.typing@email.com'
    );
  });

  test('.clear() - clears an input or textarea element', async ({ page }) => {
    // https://on.cypress.io/clear
    await page.locator('.action-clear').fill('Clear this text');
    await expect(page.locator('.action-clear')).toHaveValue('Clear this text');
    await page.locator('.action-clear').clear();
    await expect(page.locator('.action-clear')).toHaveValue('');
  });

  test('.dblclick() - double click on a DOM element', async ({ page }) => {
    // https://on.cypress.io/dblclick

    // Our app has a listener on 'dblclick' event in our 'scripts.js'
    // that hides the div and shows an input on double click
    await page.locator('.action-div').dblclick();
    await expect(page.locator('.action-div')).not.toBeVisible();
    await expect(page.locator('.action-input-hidden')).toBeVisible();
  });

  test('.rightclick() - right click on a DOM element', async ({ page }) => {
    // https://on.cypress.io/rightclick

    // Our app has a listener on 'contextmenu' event in our 'scripts.js'
    // that hides the div and shows an input on right click
    await page.locator('.rightclick-action-div').click({ button: 'right' });
    await expect(page.locator('.rightclick-action-div')).not.toBeVisible();
    await expect(page.locator('.rightclick-action-input-hidden')).toBeVisible();
  });

  test('.check() - check a checkbox or radio element', async ({ page }) => {
    // https://on.cypress.io/check
    await page
      .locator('.action-checkboxes [type="checkbox"]')
      .locator(':scope:not([disabled])')
      .first()
      .check();
    await expect(
      page
        .locator('.action-checkboxes [type="checkbox"]')
        .locator(':scope:not([disabled])')
        .first()
    ).toBeChecked();
    await page
      .locator('.action-radios [type="radio"]')
      .locator(':scope:not([disabled])')
      .first()
      .check();
    await expect(
      page
        .locator('.action-radios [type="radio"]')
        .locator(':scope:not([disabled])')
        .first()
    ).toBeChecked();
  });

  test('.select() - select an option in a <select> element', async ({
    page,
  }) => {
    // https://on.cypress.io/select

    // at first, no option should be selected
    await expect(page.locator('.action-select')).toHaveValue(
      '--Select a fruit--'
    );

    // Select option(s) with matching text content
    await page.locator('.action-select').selectOption({ label: 'apples' });
    // confirm the apples were selected
    // note that each value starts with "fr-" in our HTML
    await expect(page.locator('.action-select')).toHaveValue('fr-apples');
    await page
      .locator('.action-select-multiple')
      .selectOption([
        { label: 'apples' },
        { label: 'oranges' },
        { label: 'bananas' },
      ]);
    await expect(page.locator('.action-select-multiple')).toHaveValues([
      'fr-apples',
      'fr-oranges',
      'fr-bananas',
    ]);
  });

  test('.trigger() - trigger an event on a DOM element', async ({ page }) => {
    // https://on.cypress.io/trigger
    await page.locator('.trigger-input-range').dispatchEvent('change');
  });
});
