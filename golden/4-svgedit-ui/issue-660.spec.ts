import { visitAndApproveStorage } from '../../../support/ui-test-helper.js';

// See https://github.com/SVG-Edit/svgedit/issues/660
test.describe('Fix issue 660', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
    await page.setViewportSize({ width: 512, height: 512 });
  });
  /** @todo: reenable this test when we understand why it is passing locally but not on ci */
  test.skip('can resize text', async function ({ page }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
       <text fill="#000000" id="a_text" text-anchor="middle" x="260.5" xml:space="preserve" y="192.5" font-size="40">hello</text>
      </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    await expect(page.locator('#a_text')).toBeVisible();
    await page.locator('#a_text').down();
    await page.mouse.up();
    await page.locator('#selectorGrip_resize_s').down();
    await page.mouse.move();
    await page.mouse.up();

    // svgedit use the #text text field to capture the text
    await expect(page.locator('#a_text')).toHaveAttribute(
      'transform',
      'matrix(1 0 0 4.54639 0 -540.825)'
    ); // Chrome 96 is matrix(1 0 0 4.17431 0 -325.367)
  });
});
