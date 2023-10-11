import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use rect/square tools of svg-edit', function () {
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
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect', async function ({ page }) {
    await page.locator('#tool_rect').click();
    await page.locator('#svgcontent').down(150, 150);
    await page.mouse.move(250, 200);
    await page.mouse.up();
    page.FIXME_svgSnapshot();
  });
  test('check tool_fhrect', async function ({ page }) {
    await page.locator('#tool_fhrect').click();
    await page.locator('#svgcontent').down(200, 80);
    await page.mouse.move(320, 80);
    await page.mouse.move(320, 180);
    await page.mouse.move(200, 180);
    await page.mouse.move(200, 80);
    await page.mouse.up(200, 80);
    page.FIXME_svgSnapshot();
  });
  test('check tool_square', async function ({ page }) {
    await page.locator('#tool_square').click();
    await page.locator('#svgcontent').down(75, 150);
    await page.mouse.move(125, 200);
    await page.mouse.up();
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_fill_color', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#js-se-palette').locator('.square').nth(8).click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_rotation', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 5; n++) {
      await page
        .locator('#angle')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_blur', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#blur')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_opacity', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#opacity')
        .locator('elix-number-spin-box')
        .first()
        .locator('#downButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_fhrect_change_x_y_coordinate', async function ({ page }) {
    await page.locator('#svg_2').click();
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#selected_x')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#selected_y')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_fhrect_change_width_height', async function ({ page }) {
    await page.locator('#svg_2').click();
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#rect_width')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#rect_height')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_square_clone', async function ({ page }) {
    await page.locator('#svg_3').click();
    await page.locator('#tool_clone').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_square_bring_to_back', async function ({ page }) {
    await page.locator('#svg_3').click();
    await page.locator('#tool_move_bottom').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_square_bring_to_front', async function ({ page }) {
    await page.locator('#svg_3').click();
    await page.locator('#tool_move_top').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_square_change_corner_radius', async function ({ page }) {
    await page.locator('#svg_4').click();
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#rect_rx')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_to_path', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_topath').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_delete', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_delete').click();
    await page.locator('#svg_3').click();
    await page.locator('#tool_delete').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_rect_change_class', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page
      .locator('#elem_class')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .fill('svg_2_class');
    await page
      .locator('#elem_class')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .press('Enter');
    await page.locator('#svg_2').FIXME_should('satisfy', ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes('svg_2_class');
    });
  });
  test('check tool_rect_change_id', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#svg_2').click();
    await page
      .locator('#elem_id')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .fill('_id');
    await page
      .locator('#elem_id')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .press('Enter');
    await page.locator('#svg_2_id').FIXME_should('satisfy', ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes('svg_2_class');
    });
  });
});
