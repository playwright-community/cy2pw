import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/726
test.describe('Fix issue 726', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('Send forward and send backward should move one layer at a time', async function ({
    page,
  }) {
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(250, 250);
    await page.mouse.move(350, 350);
    await page.mouse.up();
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(10, 0);
    await page.mouse.move(100, 100);
    await page.mouse.up();
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(10, 10);
    await page.mouse.move(100, 100);
    await page.mouse.up();
    await page
      .locator('#svg_3')
      .click({ button: 'right', position: { x: 0, y: 0 } });
    await page.locator('a:contains("Send Backward")').click();
    await expect(async () => {
      const $div = page.locator('#svg_2');
      const id = $div.nth(0).previousElementSibling.id;
      assert.equal(id, 'svg_3');
    }).toPass();
  });
});
