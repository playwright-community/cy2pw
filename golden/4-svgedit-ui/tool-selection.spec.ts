import { test, expect } from '@playwright/test';

import { visitAndApproveStorage } from '../../support/ui-test-helper.js';

test.describe('UI - Tool selection', function () {
  test.beforeEach(async ({ page }) => {
    visitAndApproveStorage();
  });

  test('should set rectangle selection by click', async function ({ page }) {
    await expect(page.locator('#tools_rect')).not.toHaveAttribute(
      'pressed',
      /.*/
    );
    await page.locator('#tools_rect').dispatchEvent('click');
    await expect(page.locator('#tools_rect')).toHaveAttribute('pressed', /.*/);
  });
});
