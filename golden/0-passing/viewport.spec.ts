import { test, expect } from '@playwright/test';

test.describe('Viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/viewport');
  });

  test('cy.viewport() - set the viewport size and dimension', async ({
    page,
  }) => {
    // https://on.cypress.io/viewport
    await expect(page.locator('#navbar')).toBeVisible();
    await page.setViewportSize({ width: 320, height: 480 });

    // the navbar should have collapse since our screen is smaller
    await expect(page.locator('#navbar')).not.toBeVisible();
    await expect(page.locator('.navbar-toggle')).toBeVisible();
    await page.locator('.navbar-toggle').click();
    await expect(page.locator('.nav').locator('a').first()).toBeVisible();

    // lets see what our app looks like on a super large screen
    await page.setViewportSize({ width: 2999, height: 2999 });

    // cy.viewport() accepts a set of preset sizes
    // to easily set the screen to a device's width and height

    // We added a cy.wait() between each viewport change so you can see
    // the change otherwise it is a little too fast to see :)
    // macbook-15
    await page.setViewportSize({ width: 1440, height: 900 }); // macbook-13
    await page.setViewportSize({ width: 1280, height: 800 }); // macbook-11
    await page.setViewportSize({ width: 1366, height: 768 }); // ipad-2
    await page.setViewportSize({ width: 768, height: 1024 }); // ipad-mini
    await page.setViewportSize({ width: 768, height: 1024 }); // iphone-6+
    await page.setViewportSize({ width: 414, height: 736 }); // iphone-6
    await page.setViewportSize({ width: 375, height: 667 }); // iphone-5
    await page.setViewportSize({ width: 320, height: 568 }); // iphone-4
    await page.setViewportSize({ width: 320, height: 480 }); // iphone-3
    await page.setViewportSize({ width: 320, height: 480 });

    // cy.viewport() accepts an orientation for all presets
    // the default orientation is 'portrait'
    // ipad-2
    await page.setViewportSize({ width: 768, height: 1024 }); // iphone-4, landscape
    await page.setViewportSize({ width: 480, height: 320 });
  });
});
