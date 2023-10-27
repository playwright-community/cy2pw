import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('use path tools of svg-edit', function () {
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
  test('check tool_path', async function ({ page }) {
    await page.locator('#tool_path').click();
    await page.locator('#svgcontent').down(50, 50);
    await page.mouse.up();
    await page.mouse.move(100, 50);
    await page.mouse.down(100, 50);
    await page.mouse.up();
    await page.mouse.move(75, 150);
    await page.mouse.down(75, 150);
    await page.mouse.up();
    await page.mouse.move(0, 0);
    await page.mouse.down(0, 0);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_path_change_node_xy', async function ({ page }) {
    await page.locator('#svg_1').click();
    await page.locator('#svg_1').dblclick();
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#path_node_x')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    for (let n = 0; n < 25; n++) {
      await page
        .locator('#path_node_y')
        .locator('elix-number-spin-box')
        .first()
        .locator('#upButton')
        .first()
        .click();
    }
    await svgSnapshot(page);
  });
  test('check tool_path_change_seg_type', async function ({ page }) {
    // cy.get('#svg_1').click({ force: true })
    await page.locator('#svg_1').dblclick();
    await page
      .locator('#seg_type')
      .locator('select')
      .selectOption({ label: '6' });
    await expect(page.locator('#seg_type').locator('select')).toHaveValue('6');
    await page.locator('#ctrlpointgrip_3c1').down();
    await page.mouse.move(130, 175);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_path_change_clone_node', async function ({ page }) {
    // cy.get('#svg_1').click({ force: true })
    await page.locator('#svg_1').dblclick();
    await page.locator('#tool_node_clone').click();
    await page.locator('#pathpointgrip_4').down();
    await page.mouse.move(130, 175);
    await page.mouse.up();
    await svgSnapshot(page);
  });
  test('check tool_path_openclose', async function ({ page }) {
    await page.locator('#tool_select').click();
    await page.locator('#svg_1').click();
    await page.locator('#svg_1').dblclick();
    await page.locator('#tool_openclose_path').click();
    await svgSnapshot(page);
  });
  /* it('check tool_path_add_subpath', function () {
    cy.get('#tool_add_subpath').click({ force: true });
    cy.get('#svgcontent')
      .trigger('mousedown', 0, 0, { force: true })
      .trigger('mouseup', { force: true })
      .trigger('mousemove', 100, 50, { force: true })
      .trigger('mousedown', 100, 50, { force: true })
      .trigger('mouseup', { force: true })
      .trigger('mousemove', 75, 150, { force: true })
      .trigger('mousedown', 75, 150, { force: true })
      .trigger('mouseup', { force: true })
      .trigger('mousemove', 0, 0, { force: true })
      .trigger('mousedown', 0, 0, { force: true })
      .trigger('mouseup', { force: true });
    cy.get('#tool_select').click({ force: true });
    cy.svgSnapshot();
  }); */
});
