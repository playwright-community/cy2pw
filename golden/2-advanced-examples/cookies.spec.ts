import { test, expect } from '@playwright/test';

test.describe('Cookies', () => {
  test.beforeEach(async ({ page }) => {
    Cypress.Cookies.debug(true);
    await page.goto('https://example.cypress.io/commands/cookies');

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    page.FIXME_clearCookies();
  });

  test('cy.getCookie() - get a browser cookie', async ({ page }) => {
    // https://on.cypress.io/getcookie
    await page.locator('#getCookie .set-a-cookie').click();

    // cy.getCookie() yields a cookie object
    page.FIXME_getCookie('token');
    await page.FIXME_should('have.property', 'value', '123ABC');
  });

  test('cy.getCookies() - get browser cookies', async ({ page }) => {
    // https://on.cypress.io/getcookies
    page.FIXME_getCookies();
    await page.FIXME_should('be.empty');
    await page.locator('#getCookies .set-a-cookie').click();

    // cy.getCookies() yields an array of cookies
    page.FIXME_getCookies();
    await page.FIXME_should('have.length', 1);
    await expect(async () => {
      const cookies = page;
      // each cookie has these properties
      expect(cookies[0]).toHaveProperty('name', 'token');
      expect(cookies[0]).toHaveProperty('value', '123ABC');
      expect(cookies[0]).toHaveProperty('httpOnly', false);
      expect(cookies[0]).toHaveProperty('secure', false);
      expect(cookies[0]).toHaveProperty('domain');
      expect(cookies[0]).toHaveProperty('path');
    }).toPass();
  });

  test('cy.setCookie() - set a browser cookie', async ({ page }) => {
    // https://on.cypress.io/setcookie
    page.FIXME_getCookies();
    await page.FIXME_should('be.empty');
    page.FIXME_setCookie('foo', 'bar');

    // cy.getCookie() yields a cookie object
    page.FIXME_getCookie('foo');
    await page.FIXME_should('have.property', 'value', 'bar');
  });

  test('cy.clearCookie() - clear a browser cookie', async ({ page }) => {
    // https://on.cypress.io/clearcookie
    page.FIXME_getCookie('token');
    await page.FIXME_should('be.null');
    await page.locator('#clearCookie .set-a-cookie').click();
    page.FIXME_getCookie('token');
    await page.FIXME_should('have.property', 'value', '123ABC');

    // cy.clearCookies() yields null
    page.FIXME_clearCookie('token');
    await page.FIXME_should('be.null');
    page.FIXME_getCookie('token');
    await page.FIXME_should('be.null');
  });

  test('cy.clearCookies() - clear browser cookies', async ({ page }) => {
    // https://on.cypress.io/clearcookies
    page.FIXME_getCookies();
    await page.FIXME_should('be.empty');
    await page.locator('#clearCookies .set-a-cookie').click();
    page.FIXME_getCookies();
    await page.FIXME_should('have.length', 1);

    // cy.clearCookies() yields null
    page.FIXME_clearCookies();
    page.FIXME_getCookies();
    await page.FIXME_should('be.empty');
  });
});
