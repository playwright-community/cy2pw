import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('check tool shape and image of svg-edit', function () {
  test.beforeAll(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('check tool_source_set', async function ({ page }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
       </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    await svgSnapshot(page);
  });
  test('check tool_shape', async function ({ page }) {
    await page.locator('#tool_shapelib').locator('.overall').first().click();
    await page.locator('[data-shape="heart"]').click();
    await page.locator('#svgroot').move();
    await page.mouse.down();
    await page.mouse.move();
    await page.mouse.up();
    await page.locator('#selectorGrip_rotate').down();
    await page.mouse.move();
    await page.mouse.up();

    // issue with snapshot not being consistent on CI/Interactive
    // cy.svgSnapshot()
    // so we use typical DOM tests to validate
    await expect(page.locator('#svg_1')).toHaveAttribute('d', /.*/);

    // cy.get('#a_text').should('have.attr', 'transform')
    //  .and('equal', 'matrix(1 0 0 4.54639 0 -540.825)') // Chrome 96 is matrix(1 0 0 4.17431 0 -325.367)
  });
  test('check tool_image', async function ({ page }) {
    await page.locator('#tool_image').click();
    await page.locator('#svgroot').down();
    await page.mouse.move();
    await page.mouse.up();

    // eslint-disable-next-line promise/catch-or-return
    const $win = await page.evaluateHandle('window');
    await $win.evaluate(($win) => {
      $win.FIXME_contains('OK');
    });

    // issue with snapshot not being consistent on CI/Interactive
    // cy.svgSnapshot()
    // so we use typical DOM tests to validate
    await expect(page.locator('#svg_2')).toHaveAttribute(
      'xlink:href',
      './images/logo.svg'
    );
  });
});
