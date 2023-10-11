import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/408
test.describe('Fix issue 408', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('should not throw when showing/saving svg content', async function ({
    page,
  }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
       <g id="svg_6">
        <rect fill="#FF0000" height="71" stroke="#000000" stroke-width="5" width="94" x="69.5" y="51.5"/>
        <circle cx="117.5" cy="87.5" fill="#ffff00" r="19.84943" stroke="#000000" />
       </g>
      </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    await page.locator('#svg_6').click();
    await page.locator('#svg_6').dblclick(); // change context
    await page.locator('#tool_source').click(); // reopen tool_source
    await expect(page.locator('#tool_source_save')).toBeVisible(); // The save button should be here if it does not throw
  });
});
