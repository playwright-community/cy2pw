import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/359
test.describe('Fix issue 359', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('can undo without throwing', async function ({ page }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
        <rect fill="#ffff00" height="70" width="165" x="179.5" y="146.5"/>
      </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    await page.locator('#tool_undo').click();
    await page.locator('#tool_redo').click(); // test also redo to make the test more comprehensive
    // if the undo throws an error to the console, the test will fail
  });
});
