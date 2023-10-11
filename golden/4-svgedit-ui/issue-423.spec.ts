import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/423
test.describe('Fix issue 423', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('should not throw when undoing the move', async function ({ page }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
       <g class="layer" id="svg_1">
        <clipPath id="svg_2">
         <rect height="150" id="svg_3" width="50" x="50" y="50"/>
        </clipPath>
        <rect clip-path="url(#svg_2)" fill="#0033b5" height="174.9" id="TANK1" width="78" x="77.5" y="29"/>
       </g>
      </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    await page.locator('#TANK1').down();
    await page.mouse.move(50, 0);
    await page.mouse.up();
    await page.locator('#tool_undo').click();
  });
});
