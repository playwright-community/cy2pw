import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use text tools of svg-edit', function () {
  test.beforeAll(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('check tool_source', async function ({ page }) {
    await page.locator('#tool_source').click();
    await page.locator('#svg_source_textarea').fill(
      `<svg width="640" height="480" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
      <g class="layer">
       <title>Layer 1</title>
       </g>
     </svg>`
    );
    await page.locator('#tool_source_save').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text', async function ({ page }) {
    await page.locator('#tool_text').click();
    await page.locator('#svgroot').down();
    await page.mouse.up();

    // svgedit use the #text text field to capture the text
    await page.locator('#text').fill('AB');
    // force text position for snapshot tests being consistent on CI/Interactive
    await page
      .locator('#selected_x')
      .locator('elix-number-spin-box')
      .first()
      .locator('#inner')
      .first()
      .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
    await page
      .locator('#selected_x')
      .locator('elix-number-spin-box')
      .first()
      .locator('#inner')
      .first()
      .fill('200');
    await page
      .locator('#selected_y')
      .locator('elix-number-spin-box')
      .first()
      .locator('#inner')
      .first()
      .press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
    await page
      .locator('#selected_y')
      .locator('elix-number-spin-box')
      .first()
      .locator('#inner')
      .first()
      .fill('200');
    page.FIXME_svgSnapshot();

    // cy.get('#svg_1').should('exist')
  });
  test('check tool_clone', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_clone').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_italic', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_italic').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_bold', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_bold').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_x_y_coordinate', async function ({ page }) {
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
  test('check tool_text_change_font_size', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#font_size')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_stroke_width', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page
      .locator('#stroke_width')
      .locator('elix-number-spin-box')
      .first()
      .locator('#upButton')
      .first()
      .click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_stoke_fill_color', async function ({ page }) {
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
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_blur', async function ({ page }) {
    await page.locator('#svg_2').click();
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
  test('check tool_text_change_opacity', async function ({ page }) {
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
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_align_to_page', async function ({ page }) {
    await page.locator('#svg_2').click();
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
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_class', async function ({ page }) {
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
  test('check tool_text_change_id', async function ({ page }) {
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
  test('check tool_text_delete', async function ({ page }) {
    await page.locator('#svg_2_id').click();
    await page.locator('#tool_delete').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_font_family', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page
      .locator('#tool_font_family')
      .locator('select')
      .selectOption({ label: 'Serif' });
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_decoration_underline', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_text_decoration_underline').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_decoration_linethrough', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_text_decoration_linethrough').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_decoration_overline', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#tool_text_decoration_overline').click();
    page.FIXME_svgSnapshot();
  });
  test('check tool_letter_spacing', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 10; n++) {
      await page
        .locator('#tool_letter_spacing')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_word_spacing', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 15; n++) {
      await page
        .locator('#tool_word_spacing')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_length', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 20; n++) {
      await page
        .locator('#tool_text_length')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    page.FIXME_svgSnapshot();
  });
  test('check tool_length_adjust', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page
      .locator('#tool_length_adjust')
      .locator('select')
      .FIXME_select(1, { force: true });
    page.FIXME_svgSnapshot();
  });
  test('check tool_text_change_rotation', async function ({ page }) {
    await page.locator('#svg_1').click();
    for (let n = 0; n < 6; n++) {
      await page
        .locator('#angle')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await expect(page.locator('#svg_1')).toHaveAttribute(
      'transform',
      /rotate\(30/
    );
    // snapshot removed below for inconsistency between local and CI tests.
    // cy.svgSnapshot()
  });
});
