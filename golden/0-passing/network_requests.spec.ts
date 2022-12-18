import { test, expect } from '@playwright/test';

test.describe('Network Requests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/network-requests');
  });

  // Manage HTTP requests in your app

  test('cy.request() - make an XHR request', async ({ page }) => {
    // https://on.cypress.io/request
    const response = await page.request.get(
      'https://jsonplaceholder.cypress.io/comments'
    );
    expect(response.status()).toBe(200);
    // the server sometimes gets an extra comment posted from another machine
    // which gets returned as 1 extra object
    expect(await response.json()).toHaveProperty('length');
    expect([500, 501]).toContain((await response.json()).length);
    expect(response).toHaveProperty('headers');
  });

  test('cy.request() - verify response using BDD syntax', async ({ page }) => {
    const response = await page.request.get(
      'https://jsonplaceholder.cypress.io/comments'
    );

    // https://on.cypress.io/assertions
    expect(response.status()).toBe(200);
    expect(await response.json()).toHaveProperty('length');
    expect([500, 501]).toContain((await response.json()).length);
  });
});
