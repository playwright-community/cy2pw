import { test, expect } from '@playwright/test';

test.describe('Cookies', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/cookies');

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    await page.context().clearCookies();
  });

  test('cy.getCookie() - get a browser cookie', async ({ page }) => {
    // https://on.cypress.io/getcookie
    await page.locator('#getCookie .set-a-cookie').click();

    // cy.getCookie() yields a cookie object
    const cookie = (await page.context().cookies()).find(
      (c) => c.name === 'token'
    );
    expect(cookie).toHaveProperty('value', '123ABC');
  });

  test('cy.getCookies() - get browser cookies', async ({ page }) => {
    // https://on.cypress.io/getcookies
    expect(await page.context().cookies()).toHaveLength(0);
    await page.locator('#getCookies .set-a-cookie').click();

    // cy.getCookies() yields an array of cookies
    expect(await page.context().cookies()).toHaveLength(1);
    const cookies = await page.context().cookies();
    // each cookie has these properties
    expect(cookies[0]).toHaveProperty('name', 'token');
    expect(cookies[0]).toHaveProperty('value', '123ABC');
    expect(cookies[0]).toHaveProperty('httpOnly', false);
    expect(cookies[0]).toHaveProperty('secure', false);
    expect(cookies[0]).toHaveProperty('domain');
    expect(cookies[0]).toHaveProperty('path');
  });

  test('cy.setCookie() - set a browser cookie', async ({ page }) => {
    // https://on.cypress.io/setcookie
    expect(await page.context().cookies()).toHaveLength(0);
    await page
      .context()
      .addCookies([{ name: 'foo', value: 'bar', url: page.url() }]);

    // cy.getCookie() yields a cookie object
    const cookie = (await page.context().cookies()).find(
      (c) => c.name === 'foo'
    );
    expect(cookie).toHaveProperty('value', 'bar');
  });

  test('cy.clearCookies() - clear browser cookies', async ({ page }) => {
    // https://on.cypress.io/clearcookies
    expect(await page.context().cookies()).toHaveLength(0);
    await page.locator('#clearCookies .set-a-cookie').click();
    expect(await page.context().cookies()).toHaveLength(1);

    // cy.clearCookies() yields null
    await page.context().clearCookies();
    expect(await page.context().cookies()).toHaveLength(0);
  });
});
