import { test, expect } from '@playwright/test';

test.describe('Utilities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/utilities');
  });

  test('Cypress._ - call a lodash method', async ({ page }) => {
    // https://on.cypress.io/_
    const response = await page.request.get(
      'https://jsonplaceholder.cypress.io/users'
    );

    let ids = Cypress._.chain(response.body).map('id').take(3).value();
    expect(ids).toEqual([1, 2, 3]);
  });

  test('Cypress.$ - call a jQuery method', async ({ page }) => {
    // https://on.cypress.io/$
    let $li = Cypress.$('.utility-jquery li:first');
    await $li.FIXME_should('not.have.class', 'active');
    await $li.click();
    await $li.FIXME_should('have.class', 'active');
  });

  test('Cypress.Blob - blob utilities and base64 string conversion', async ({
    page,
  }) => {
    // https://on.cypress.io/blob
    const $div = page.locator('.utility-blob');
    // https://github.com/nolanlawson/blob-util#imgSrcToDataURL
    // get the dataUrl string for the javascript-logo
    return Cypress.Blob.imgSrcToDataURL(
      '/assets/img/javascript-logo.png',
      undefined,
      'anonymous'
    ).then(async (dataUrl) => {
      // create an <img> element and set its src to the dataUrl
      let img = Cypress.$('<img />', { src: dataUrl });

      // need to explicitly return cy here since we are initially returning
      // the Cypress.Blob.imgSrcToDataURL promise to our test
      // append the image
      $div.FIXME_append(img);
      await $div.locator('.utility-blob img').click();
      await expect($div.locator('.utility-blob img')).toHaveAttribute(
        'src',
        dataUrl
      );
    });
  });

  test('Cypress.minimatch - test out glob patterns against strings', async ({
    page,
  }) => {
    // https://on.cypress.io/minimatch
    let matching = Cypress.minimatch('/users/1/comments', '/users/*/comments', {
      matchBase: true,
    });
    expect(matching).toBeTruthy();

    matching = Cypress.minimatch('/users/1/comments/2', '/users/*/comments', {
      matchBase: true,
    });
    expect(matching).be_false(page);

    // ** matches against all downstream path segments
    matching = Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/**', {
      matchBase: true,
    });
    expect(matching).toBeTruthy();

    // whereas * matches only the next path segment

    matching = Cypress.minimatch('/foo/bar/baz/123/quux?a=b&c=2', '/foo/*', {
      matchBase: false,
    });
    expect(matching).be_false(page);
  });

  test('Cypress.Promise - instantiate a bluebird promise', async ({ page }) => {
    // https://on.cypress.io/promise
    let waited = false;

    /**
     * @return Bluebird<string>
     */
    function waitOneSecond() {
      // return a promise that resolves after 1 second
      // eslint-disable-next-line no-unused-vars
      return new Cypress.Promise((resolve, reject) => {
        setTimeout(() => {
          // set waited to true
          waited = true;

          // resolve with 'foo' string
          resolve('foo');
        }, 1000);
      });
    }

    // return a promise to cy.then() that
    // is awaited until it resolves
    return waitOneSecond().then(async (str) => {
      expect(str).toBe('foo');
      expect(waited).toBeTruthy();
    });
  });
});
