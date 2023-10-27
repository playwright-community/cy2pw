import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use star tools of svg-edit', function () {
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
  test('check tool_star', async function ({ page }) {
    await page.locator('#tool_star').click();
    await page.locator('#svgcontent').down(300, 150);
    await page.mouse.move(300, 250);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_star_clone', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_clone').click();
    await svgSnapshot(page);
  });
  test('check tool_star_change_class', async function ({ page }) {
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
  test('check tool_star_change_id', async function ({ page }) {
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
  test('check tool_star_change_rotation', async function ({ page }) {
    await page.locator('#svg_2_id').click();
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
  test('check tool_star_change_blur', async function ({ page }) {
    await page.locator('#svg_2_id').click();
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
  test('check tool_star_change_opacity', async function ({ page }) {
    await page.locator('#svg_2_id').click();
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
  test('check tool_star_bring_to_back', async function ({ page }) {
    await page.locator('#svg_2_id').click();
    await page.locator('#tool_move_bottom').click();
    await svgSnapshot(page);
  });
  test('check tool_star_bring_to_front', async function ({ page }) {
    await page.locator('#svg_2_id').click();
    await page.locator('#tool_move_top').click();
    await svgSnapshot(page);
  });
  test('check tool_star_delete', async function ({ page }) {
    await page.locator('#svg_2_id').click();
    await page.locator('#tool_delete').click();
    await svgSnapshot(page);
  });
  test('check tool_star_align_to_page', async function ({ page }) {
    await page.locator('#svg_1').click();
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
  test('check tool_star_change_stroke_width', async function ({ page }) {
    await page.locator('#svg_1').click();
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
  test('check tool_star_change_stoke_fill_color', async function ({ page }) {
    await page.locator('#svg_1').click();
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
      .nth(51)
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
    await page.locator('#fill_color').locator('#picker').first().click();
    await page
      .locator('#fill_color')
      .locator('#color_picker')
      .first()
      .locator('#jGraduate_colPick')
      .first()
      .locator('#jPicker-table')
      .first()
      .locator('.QuickColor')
      .nth(3)
      .click();
    await page
      .locator('#fill_color')
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
  test('check tool_star_change_sides', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page
      .locator('#starNumPoints')
      .locator('elix-number-spin-box')
      .first()
      .locator('#upButton')
      .first()
      .click();
    await svgSnapshot(page);
  });
});
