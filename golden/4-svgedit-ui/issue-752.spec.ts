import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/752
test.describe('Fix issue 752', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('Moving an unsnapped shape will not cause selector box misalignment', async function ({
    page,
  }) {
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(12, 12);
    await page.mouse.move(99, 99);
    await page.mouse.up();
    await page.locator('#svg_1').click();
    await page.locator('#tool_editor_prefs').click();
    const elem = page.locator('#grid_snapping_step');
    elem.FIXME_val('35');
    await page.locator('#grid_snapping_on').click();
    await page.locator('#tool_prefs_save').click();
    await page.locator('#svg_1').down(20, 20);
    await page.mouse.move(203, 205);
    await page.mouse.up();
    await expect(page.locator('#selectedBox0')).toHaveAttribute(
      'd',
      'M192,194 L284,194 284,286 192,286z'
    );
  });
});
