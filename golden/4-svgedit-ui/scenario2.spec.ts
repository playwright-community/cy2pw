import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use ellipse and circle of svg-edit', function () {
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
  test('check tool_circle', async function ({ page }) {
    await page.locator('#tool_circle').click();
    await page.locator('#svgcontent').down(200, 200);
    await page.mouse.move(300, 200);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_fhellipse', async function ({ page }) {
    await page.locator('#tool_fhellipse').click();
    await page.locator('#svgcontent').down(400, 200);
    await page.mouse.move();
    await page.mouse.move();
    await page.mouse.move();
    await page.mouse.move();
    await page.mouse.up(200, 100);
    await svgSnapshot(page);
  });
  test('check tool_ellipse', async function ({ page }) {
    await page.locator('#tool_ellipse').click();
    await page.locator('#svgcontent').down(100, 300);
    await page.mouse.move(200, 200);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_circle_change_fill_color', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#js-se-palette').locator('.square').nth(8).click();
    await svgSnapshot(page);
  });
  test('check tool_circle_change_opacity', async function ({ page }) {
    await page.locator('#svg_2').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#opacity')
        .locator('elix-number-spin-box')
        .first()
        .locator('#downButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_ellipse_change_rotation', async function ({ page }) {
    await page.locator('#svg_3').click();
    for (let n = 0; n < 5; n++) {
      await page
        .locator('#angle')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_ellipse_change_blur', async function ({ page }) {
    await page.locator('#svg_3').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#blur')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_ellipse_change_cx_cy_coordinate', async function ({ page }) {
    await page.locator('#svg_3').click();
    for (let n = 0; n < 20; n++) {
      await page
        .locator('#ellipse_cx')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 20; n++) {
      await page
        .locator('#ellipse_cy')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_ellipse_change_rx_ry_radius', async function ({ page }) {
    await page.locator('#svg_3').click();
    for (let n = 0; n < 20; n++) {
      await page
        .locator('#ellipse_rx')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 20; n++) {
      await page
        .locator('#ellipse_ry')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_ellipse_bring_to_back', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_move_bottom').click();
    await svgSnapshot(page);
  });
  test('check tool_ellipse_bring_to_front', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_move_top').click();
    await svgSnapshot(page);
  });
  test('check tool_ellipse_clone', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_clone').click();
    await svgSnapshot(page);
  });
});
