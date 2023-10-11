import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('UI - Clipboard', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('Editor - Copy and paste', async ({ page }) => {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
   <g class="layer">
    <title>Layer 1</title>
    <circle cx="100" cy="100" r="50" fill="#FF0000" id="testCircle" stroke="#000000" stroke-width="5"/>
   </g>
  </svg>`
    );
    await page.locator('#tool_source_save').click();
    await expect(page.locator('#testCircle')).toBeVisible();
    await expect(page.locator('#svg_1')).not.toBeVisible();
    await expect(page.locator('#svg_2')).not.toBeVisible();

    // Copy.
    await page.locator('#testCircle').click();
    await page.locator('#testCircle').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#copy"]').click();

    // Paste.
    // Scrollbars fail to recenter in Cypress test.  Works fine in reality.
    // Thus forcing click is needed since workspace is mostly offscreen.
    await page.locator('#svgroot').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#paste"]').click();
    await expect(page.locator('#testCircle')).toBeVisible();
    await expect(page.locator('#svg_1')).toBeVisible();
    await expect(page.locator('#svg_2')).not.toBeVisible();

    // Cut.
    await page.locator('#testCircle').click();
    await page.locator('#testCircle').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#cut"]').click();
    await expect(page.locator('#testCircle')).not.toBeVisible();
    await expect(page.locator('#svg_1')).toBeVisible();
    await expect(page.locator('#svg_2')).not.toBeVisible();

    // Paste.
    // Scrollbars fail to recenter in Cypress test.  Works fine in reality.
    // Thus forcing click is needed since workspace is mostly offscreen.
    await page.locator('#svgroot').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#paste"]').click();
    await expect(page.locator('#testCircle')).not.toBeVisible();
    await expect(page.locator('#svg_1')).toBeVisible();
    await expect(page.locator('#svg_2')).toBeVisible();

    // Delete.
    await page.locator('#svg_2').click();
    await page.locator('#svg_2').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#delete"]').click();
    await page.locator('#svg_1').click();
    await page.locator('#svg_1').click({ button: 'right' });
    await page.locator('#cmenu_canvas a[href="#delete"]').click();
    await expect(page.locator('#svg_1')).not.toBeVisible();
    await expect(page.locator('#svg_2')).not.toBeVisible();
  });
});
