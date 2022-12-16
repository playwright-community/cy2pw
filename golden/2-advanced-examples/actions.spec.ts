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
    await page.keyboard.down('Alt');
    await page.keyboard.down('Alt');
    await page.keyboard.up('Alt');
    await page.keyboard.up('Alt');
    await page.keyboard.down('Control');
    await page.keyboard.down('Control');
    await page.keyboard.up('Control');
    await page.keyboard.up('Control');
    await page.keyboard.down('Meta');
    await page.keyboard.down('Meta');
    await page.keyboard.down('Meta');
    await page.keyboard.up('Meta');
    await page.keyboard.up('Meta');
    await page.keyboard.up('Meta');
    await page.keyboard.down('Shift');
    await page.keyboard.up('Shift');
    await page
      .locator('.action-email')
      .type('slow.typing@email.com', { delay: 100 });
    await expect(page.locator('.action-email')).toHaveValue(
      'slow.typing@email.com'
    );
    await page
      .locator('.action-disabled')
      .fill('disabled error checking', { force: true });
    await expect(page.locator('.action-disabled')).toHaveValue(
      'disabled error checking'
    );
  });

  test('.focus() - focus on a DOM element', async ({ page }) => {
    // https://on.cypress.io/focus
    await page.locator('.action-focus').focus();
    await expect(page.locator('.action-focus')).toHaveClass(/focus/);
    await expect(page.locator('.action-focus').FIXME_prev()).toHaveAttribute(
      'style',
      'color: orange;'
    );
  });

  test('.blur() - blur off a DOM element', async ({ page }) => {
    // https://on.cypress.io/blur
    await page.locator('.action-blur').fill('About to blur');
    await page.locator('.action-blur').blur();
    await expect(page.locator('.action-blur')).toHaveClass(/error/);
    await expect(page.locator('.action-blur').FIXME_prev()).toHaveAttribute(
      'style',
      'color: red;'
    );
  });

  test('.clear() - clears an input or textarea element', async ({ page }) => {
    // https://on.cypress.io/clear
    await page.locator('.action-clear').fill('Clear this text');
    await expect(page.locator('.action-clear')).toHaveValue('Clear this text');
    await page.locator('.action-clear').clear();
    await expect(page.locator('.action-clear')).toHaveValue('');
  });

  test('.submit() - submit a form', async ({ page }) => {
    // https://on.cypress.io/submit
    await page.locator('.action-form').locator('[type="text"]').fill('HALFOFF');
    await page.locator('.action-form').evaluate((form) => form.submit());
    await expect(page.locator('.action-form').FIXME_next()).toHaveText(
      /Your form has been submitted!/
    );
  });

  test('.click() - click on a DOM element', async ({ page }) => {
    // https://on.cypress.io/click
    await page.locator('.action-btn').click();

    // You can click on 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // clicking in the center of the element is the default
    await page.locator('#action-canvas').click();
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({ position: { x: 5, y: 5 } /* topLeft*/ });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({ position: { x: 5, y: box.height / 2 } /* top*/ });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({ position: { x: box.width - 5, y: 5 } /* topRight*/ });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({ position: { x: 5, y: box.height / 2 } /* left*/ });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({
          position: { x: box.width - 5, y: box.height / 2 } /* right*/,
        });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({ position: { x: 5, y: box.height - 5 } /* bottomLeft*/ });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({
          position: { x: box.width / 2, y: box.height - 5 } /* bottom*/,
        });
    }
    {
      const box = (await page.locator('#action-canvas').boundingBox()) || {
        width: 0,
        height: 0,
      };
      await page
        .locator('#action-canvas')
        .click({
          position: { x: box.width - 5, y: box.height - 5 } /* bottomRight*/,
        });
    }

    // .click() accepts an x and y coordinate
    // that controls where the click occurs :)
    await page.locator('#action-canvas').click({ position: { x: 80, y: 75 } });
    await page.locator('#action-canvas').click({ position: { x: 170, y: 75 } });
    await page.locator('#action-canvas').click({ position: { x: 80, y: 165 } });
    await page
      .locator('#action-canvas')
      .click({ position: { x: 100, y: 185 } });
    await page
      .locator('#action-canvas')
      .click({ position: { x: 125, y: 190 } });
    await page
      .locator('#action-canvas')
      .click({ position: { x: 150, y: 185 } });
    await page
      .locator('#action-canvas')
      .click({ position: { x: 170, y: 165 } });

    // click multiple elements by passing multiple: true
    for (const locator of await page.locator('.action-labels>.label').all())
      await locator.click();

    // Ignore error checking prior to clicking
    await page.locator('.action-opacity>.btn').click({ force: true });
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

    // By default, .check() will check all
    // matching checkbox or radio elements in succession, one after another
    await page
      .locator('.action-checkboxes [type="checkbox"]')
      .locator(':scope:not([disabled])')
      .check();
    await expect(
      page
        .locator('.action-checkboxes [type="checkbox"]')
        .locator(':scope:not([disabled])')
    ).toBeChecked();
    await page
      .locator('.action-radios [type="radio"]')
      .locator(':scope:not([disabled])')
      .check();
    await expect(
      page
        .locator('.action-radios [type="radio"]')
        .locator(':scope:not([disabled])')
    ).toBeChecked();

    // .check() accepts a value argument
    await page
      .locator('.action-radios [type="radio"]')
      .locator('input[value="radio1"]:scope')
      .check();
    await expect(page.locator('.action-radios [type="radio"]')).toBeChecked();

    // .check() accepts an array of values
    await page
      .locator('.action-multiple-checkboxes [type="checkbox"]')
      .locator('input[value="checkbox1"]:scope')
      .check();
    await page
      .locator('.action-multiple-checkboxes [type="checkbox"]')
      .locator('input[value="checkbox2"]:scope')
      .check();
    await expect(
      page.locator('.action-multiple-checkboxes [type="checkbox"]')
    ).toBeChecked();

    // Ignore error checking prior to checking
    await page.locator('.action-checkboxes [disabled]').check({
      force: true,
    });
    await expect(page.locator('.action-checkboxes [disabled]')).toBeChecked();
    await page
      .locator('.action-radios [type="radio"]')
      .locator('input[value="radio3"]:scope')
      .check({
        force: true,
      });
    await expect(page.locator('.action-radios [type="radio"]')).toBeChecked();
  });

  test('.uncheck() - uncheck a checkbox element', async ({ page }) => {
    // https://on.cypress.io/uncheck

    // By default, .uncheck() will uncheck all matching
    // checkbox elements in succession, one after another
    await page
      .locator('.action-check [type="checkbox"]')
      .locator(':scope:not([disabled])')
      .uncheck();
    await expect(
      page
        .locator('.action-check [type="checkbox"]')
        .locator(':scope:not([disabled])')
    ).not.toBeChecked();

    // .uncheck() accepts a value argument
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox1"]:scope')
      .check();
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox1"]:scope')
      .uncheck();
    await expect(
      page.locator('.action-check [type="checkbox"]')
    ).not.toBeChecked();

    // .uncheck() accepts an array of values
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox1"]:scope')
      .check();
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox3"]:scope')
      .check();
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox1"]:scope')
      .uncheck();
    await page
      .locator('.action-check [type="checkbox"]')
      .locator('input[value="checkbox3"]:scope')
      .uncheck();
    await expect(
      page.locator('.action-check [type="checkbox"]')
    ).not.toBeChecked();

    // Ignore error checking prior to unchecking
    await page.locator('.action-check [disabled]').uncheck({
      force: true,
    });
    await expect(page.locator('.action-check [disabled]')).not.toBeChecked();
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

    // Select option(s) with matching value
    await page.locator('.action-select').selectOption({ label: 'fr-bananas' });
    await expect(page.locator('.action-select')).toHaveValue('fr-bananas');
    await page
      .locator('.action-select-multiple')
      .selectOption([
        { label: 'fr-apples' },
        { label: 'fr-oranges' },
        { label: 'fr-bananas' },
      ]);
    await expect(page.locator('.action-select-multiple')).toHaveValues([
      'fr-apples',
      'fr-oranges',
      'fr-bananas',
    ]);

    // assert the selected values include oranges
    await page
      .locator('.action-select-multiple')
      .FIXME_should('invoke.val.include', 'fr-oranges');
  });

  test('.scrollIntoView() - scroll an element into view', async ({ page }) => {
    // https://on.cypress.io/scrollintoview

    // normally all of these buttons are hidden,
    // because they're not within
    // the viewable area of their parent
    // (we need to scroll to see them)
    await expect(page.locator('#scroll-horizontal button')).not.toBeVisible();

    // scroll the button into view, as if the user had scrolled
    await page.locator('#scroll-horizontal button').scrollIntoViewIfNeeded();
    await expect(page.locator('#scroll-horizontal button')).toBeVisible();
    await expect(page.locator('#scroll-vertical button')).not.toBeVisible();

    // Cypress handles the scroll direction needed
    await page.locator('#scroll-vertical button').scrollIntoViewIfNeeded();
    await expect(page.locator('#scroll-vertical button')).toBeVisible();
    await expect(page.locator('#scroll-both button')).not.toBeVisible();

    // Cypress knows to scroll to the right and down
    await page.locator('#scroll-both button').scrollIntoViewIfNeeded();
    await expect(page.locator('#scroll-both button')).toBeVisible();
  });

  test('.trigger() - trigger an event on a DOM element', async ({ page }) => {
    // https://on.cypress.io/trigger

    // To interact with a range input (slider)
    // we need to set its value & trigger the
    // event to signal it changed

    // Here, we invoke jQuery's val() method to set
    // the value and trigger the 'change' event
    await page.locator('.trigger-input-range').fill('25');
    await expect(
      page.locator('input[type=range]').FIXME_siblings('p')
    ).toHaveText('25');
  });

  test('cy.scrollTo() - scroll the window or element to a position', async ({
    page,
  }) => {
    // https://on.cypress.io/scrollto

    // You can scroll to 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // if you chain .scrollTo() off of cy, we will
    // scroll the entire window
    await page.FIXME_scrollTo('bottom');
    await page.locator('#scrollable-horizontal').scrollIntoViewIfNeeded();

    // or you can scroll to a specific coordinate:
    // (x axis, y axis) in pixels
    await page.locator('#scrollable-vertical').scrollIntoViewIfNeeded();

    // or you can scroll to a specific percentage
    // of the (width, height) of the element
    await page.locator('#scrollable-both').scrollIntoViewIfNeeded();

    // control the easing of the scroll (default is 'swing')
    await page.locator('#scrollable-vertical').scrollIntoViewIfNeeded();

    // control the duration of the scroll (in ms)
    await page.locator('#scrollable-both').scrollIntoViewIfNeeded();
  });
});
