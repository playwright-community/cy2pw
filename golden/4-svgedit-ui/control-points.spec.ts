import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('UI - Control Points', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('Editor - No parameters: Drag control point of arc path', async ({
    page,
  }) => {
    const randomOffset = () => 2 + Math.round(10 + Math.random() * 40);
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
   <g class="layer">
    <title>Layer 1</title>
    <path d="m187,194a114,62 0 1 0 219,2" id="svg_1" fill="#FF0000" stroke="#000000" stroke-width="5"/>
   </g>
  </svg>`
    );
    await page.locator('#tool_source_save').click();
    await page.locator('#svg_1').click();
    await page.locator('#svg_1').click();
    await page.locator('#pathpointgrip_0').down();
    await page.mouse.move(randomOffset(), randomOffset());
    await page.mouse.up();
    await page.locator('#pathpointgrip_1').down();
    await page.mouse.move(randomOffset(), randomOffset());
    await page.mouse.up();
    await expect(page.locator('#svg_1[d]')).not.toHaveText(/NaN/);
  });
});
