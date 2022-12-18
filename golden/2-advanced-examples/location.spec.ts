import { test, expect } from '@playwright/test';

test.describe('Location', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/location');
  });

  test('cy.hash() - get the current URL hash', async ({ page }) => {
    // https://on.cypress.io/hash
    await expect(page).toHaveURL(/^[^#]*$/);
  });

  test('cy.location() - get window.location', async ({ page }) => {
    // https://on.cypress.io/location
    const location = new URL(page.url());
    expect(location.hash).toBeFalsy();
    expect(location.href).toBe('https://example.cypress.io/commands/location');
    expect(location.host).toBe('example.cypress.io');
    expect(location.hostname).toBe('example.cypress.io');
    expect(location.origin).toBe('https://example.cypress.io');
    expect(location.pathname).toBe('/commands/location');
    expect(location.port).toBe('');
    expect(location.protocol).toBe('https:');
    expect(location.search).toBeFalsy();
  });

  test('cy.url() - get the current URL', async ({ page }) => {
    // https://on.cypress.io/url
    await expect(page).toHaveURL(
      'https://example.cypress.io/commands/location'
    );
  });
});
