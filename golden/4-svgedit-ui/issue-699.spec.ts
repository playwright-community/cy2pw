import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/699
test.describe('Fix issue 699', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('should not throw error when undoing and redoing convert to path for a rectangle', async function ({
    page,
  }) {
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(150, 150);
    await page.mouse.move(250, 200);
    await page.mouse.up();
    await page.locator('#tool_topath').click();
    await page.locator('#tool_undo').click();
    await page.locator('#tool_redo').click();
    await page.locator('#tool_undo').click();
    await page.locator('#tool_redo').click();
  });
});
