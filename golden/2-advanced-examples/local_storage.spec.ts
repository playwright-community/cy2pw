import { test, expect } from '@playwright/test';

test.describe('Local Storage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/local-storage');
  });
  // Although local storage is automatically cleared
  // in between tests to maintain a clean state
  // sometimes we need to clear the local storage manually

  test('cy.clearLocalStorage() - clear all data in local storage', async ({
    page,
  }) => {
    // https://on.cypress.io/clearlocalstorage
    await page.locator('.ls-btn').click();
    expect(localStorage.getItem('prop1')).toBe('red');
    expect(localStorage.getItem('prop2')).toBe('blue');
    expect(localStorage.getItem('prop3')).toBe('magenta');

    // clearLocalStorage() yields the localStorage object
    await page.FIXME_clearLocalStorage();
    const ls = page;
    expect(ls.getItem('prop1')).toBeNull();
    expect(ls.getItem('prop2')).toBeNull();
    expect(ls.getItem('prop3')).toBeNull();
    await page.locator('.ls-btn').click();
    expect(localStorage.getItem('prop1')).toBe('red');
    expect(localStorage.getItem('prop2')).toBe('blue');
    expect(localStorage.getItem('prop3')).toBe('magenta');

    // Clear key matching string in Local Storage
    await page.FIXME_clearLocalStorage('prop1');
    {
      const ls = page;
      expect(ls.getItem('prop1')).toBeNull();
    }
    await page.locator('.ls-btn').click();
    expect(localStorage.getItem('prop1')).toBe('red');
    expect(localStorage.getItem('prop2')).toBe('blue');
    expect(localStorage.getItem('prop3')).toBe('magenta');

    // Clear keys matching regex in Local Storage
    await page.FIXME_clearLocalStorage(/prop1|2/);
    {
      const ls = page;
      expect(ls.getItem('prop1')).toBeNull();
      expect(ls.getItem('prop2')).toBeNull();
    }
  });
});
