import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use line tools of svg-edit', function () {
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
  test('check tool_line', async function ({ page }) {
    await page.locator('#tool_line').click();
    await page.locator('#svgcontent').move(200, 200);
    await page.mouse.down(200, 200);
    await page.mouse.move(250, 250);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_line_change_class', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page
      .locator('#elem_class')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .fill('svg_1_class');
    await page
      .locator('#elem_class')
      .locator('elix-input')
      .first()
      .locator('#inner')
      .first()
      .press('Enter');
    await page.locator('#svg_1').FIXME_should('satisfy', ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes('svg_1_class');
    });
  });
  test('check tool_line_change_id', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#svg_1').click();
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
    await page.locator('#svg_1_id').FIXME_should('satisfy', ($el) => {
      const classList = Array.from($el[0].classList);
      return classList.includes('svg_1_class');
    });
  });
  test('check tool_line_change_rotation', async function ({ page }) {
    await page.locator('#svg_1_id').click();
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
  test('check tool_line_change_blur', async function ({ page }) {
    await page.locator('#svg_1_id').click();
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
  test('check tool_line_change_opacity', async function ({ page }) {
    await page.locator('#svg_1_id').click();
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
  test('check tool_line_delete', async function ({ page }) {
    await page.locator('#svg_1_id').click();
    await page.locator('#tool_delete').click();
    await svgSnapshot(page);
  });
  test('check tool_line_clone', async function ({ page }) {
    await page.locator('#tool_line').click();
    await page.locator('#svgcontent').move(200, 200);
    await page.mouse.down(200, 200);
    await page.mouse.move(250, 250);
    await page.mouse.up();
    await page.locator('#svg_2').click();
    await page.locator('#tool_clone').click();
    await svgSnapshot(page);
  });
  test('check tool_line_bring_to_back', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_move_bottom').click();
    await svgSnapshot(page);
  });
  test('check tool_line_bring_to_front', async function ({ page }) {
    await page.locator('#svg_2').click();
    await page.locator('#tool_move_top').click();
    await svgSnapshot(page);
  });
  test('check tool_line_change_x_y_coordinate', async function ({ page }) {
    await page.locator('#svg_2').click();
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#line_x1')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#line_y1')
        .locator('elix-number-spin-box')
        .first()
        .locator('#downButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#line_x2')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#line_y2')
        .locator('elix-number-spin-box')
        .first()
        .locator('#downButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_line_change_stroke_width', async function ({ page }) {
    await page.locator('#svg_2').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#stroke_width')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_line_change_stoke_color', async function ({ page }) {
    await page.locator('#svg_3').click();
    await page.locator('#stroke_color').locator('#picker').first().click();
    await page
      .locator('#stroke_color')
      .locator('#color_picker')
      .first()
      .locator('#jGraduate_colPick')
      .first()
      .locator('#jPicker-table')
      .first()
      .locator('.QuickColor')
      .nth(9)
      .click();
    await page
      .locator('#stroke_color')
      .locator('#color_picker')
      .first()
      .locator('#jGraduate_colPick')
      .first()
      .locator('#jPicker-table')
      .first()
      .locator('#Ok')
      .first()
      .click();
    await svgSnapshot(page);
  });
  test('check tool_line_align_to_page', async function ({ page }) {
    await page.locator('#svg_3').click();
    await page
      .locator('#tool_position')
      .locator('#select-container')
      .first()
      .click();
    await page
      .locator('#tool_position')
      .locator('se-list-item')
      .nth(2)
      .locator('[aria-label="option"]')
      .first()
      .click();
    await svgSnapshot(page);
  });
});
