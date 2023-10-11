import { test, expect } from '@playwright/test';

import {
  visitAndApproveStorage,
  openMainMenu,
} from '../../support/ui-test-helper.js';

test.describe('UI - Export tests', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('Editor - No parameters: Has export button', async ({ page }) => {
    openMainMenu();
    await expect(page.locator('#tool_export')).toBeVisible();
  });

  test('Editor - No parameters: Export button clicking; dialog opens', async ({
    page,
  }) => {
    openMainMenu();
    await page.locator('#tool_export').click();
    await expect(page.locator('#dialog_content select')).toBeVisible();
  });
});
