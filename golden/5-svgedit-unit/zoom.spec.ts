import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('UI - Zoom tool', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('should be able to open', async function ({ page }) {
    await page.locator('#tool-wrapper > input').click();
    await expect(page.locator('#zoom').locator('#options-container')).toHaveCSS(
      'display',
      'flex'
    );
  });

  test('should be able to close', async function ({ page }) {
    await page.locator('#tool_select').click();
    await expect(page.locator('#zoom').locator('#options-container')).toHaveCSS(
      'display',
      'none'
    );
  });

  test('should be able to input zoom level', async function ({ page }) {
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('input').fill('200');
    await width.locator('#tool_select').click();
    await expect(width.locator('#canvasBackground')).toHaveAttribute(
      'width',
      (width * 2).toString()
    );
  });

  test('should be able to increment zoom level', async function ({ page }) {
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#arrow-up').click();
    await expect(width.locator('#canvasBackground')).toHaveAttribute(
      'width',
      (width * 1.1).toString()
    );
  });

  test('should be able to decrement zoom level', async function ({ page }) {
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#arrow-down').click();
    await expect(width.locator('#canvasBackground')).toHaveAttribute(
      'width',
      (width * 0.9).toString()
    );
  });

  test('should be able to select from popup', async function ({ page }) {
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#zoom').click();
    await width.locator('se-text').first().click();
    await width.locator('se-text').first().FIXME_invoke('attr', 'value');
    const value = width.locator('se-text').first();
    await expect(value.locator('#canvasBackground')).toHaveAttribute(
      'width',
      (width * (value / 100)).toString()
    );
  });

  test('should be able to resize to fit the current selection', async function ({
    page,
  }) {
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
    await page.locator('#tool_select').click();
    await page.locator('#tool_select').down(50, 50);
    await page.mouse.move(100, 50);
    await page.mouse.up();
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#zoom').click();
    await width.locator("se-text[value='layer']").click();
    await width.locator('#zoom').FIXME_invoke('attr', 'value');
    const value = width.locator('#zoom');
    await expect(value.locator('#canvasBackground')).not.toHaveAttribute(
      'width',
      '100'
    );
  });

  test('should be able to resize to fit the canvas', async function ({ page }) {
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#zoom').click();
    await width.locator("se-text[value='canvas']").click();
    await width.locator('#zoom').FIXME_invoke('attr', 'value');
    const value = width.locator('#zoom');
    await expect(value.locator('#canvasBackground')).not.toHaveAttribute(
      'width',
      '100'
    );
  });

  test('should be able to resize to fit the current layer', async function ({
    page,
  }) {
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
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#zoom').click();
    await width.locator("se-text[value='layer']").click();
    await width.locator('#zoom').FIXME_invoke('attr', 'value');
    const value = width.locator('#zoom');
    await expect(value.locator('#canvasBackground')).not.toHaveAttribute(
      'width',
      '100'
    );
  });

  test('should be able to resize to fit the current content', async function ({
    page,
  }) {
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
    await page.locator('#canvasBackground').FIXME_invoke('attr', 'width');
    const width = page.locator('#canvasBackground');
    await width.locator('#zoom').click();
    await width.locator("se-text[value='content']").click();
    await width.locator('#zoom').FIXME_invoke('attr', 'value');
    const value = width.locator('#zoom');
    await expect(value.locator('#canvasBackground')).not.toHaveAttribute(
      'width',
      '100'
    );
  });
});
