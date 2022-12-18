import { test, expect } from '@playwright/test';

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
const requiredExample = require('../../fixtures/example');

test.describe('Files', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/files');
  });

  test.beforeEach(async ({ page }) => {
    // load example.json fixture file and store
    // in the test context object
    page.FIXME_fixture('example.json');
    const example = page;
  });

  test('cy.fixture() - load a fixture', async ({ page }) => {
    // https://on.cypress.io/fixture

    // Instead of writing a response inline you can
    // use a fixture file's content.

    // when application makes an Ajax request matching "GET **/comments/*"
    // Cypress will intercept it and reply with the object in `example.json` fixture
    const getComment = page.waitForResponse('**/comments/*', {
      fixture: 'example.json',
    });

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    await page.locator('.fixture-btn').click();
    expect((await getComment).body()).toHaveProperty('name');
    expect((await getComment).body()).toContain(
      'Using fixtures to represent data'
    );
  });

  test('cy.fixture() or require - load a fixture', async function ({ page }) {
    // we are inside the "function () { ... }"
    // callback and can use test context object "this"
    // "this.example" was loaded in "beforeEach" function callback
    expect(this.example).toEqual(requiredExample);

    // or use "cy.wrap" and "should('deep.equal', ...)" assertion
    expect(this.example).toEqual(requiredExample);
  });

  test('cy.readFile() - read file contents', async ({ page }) => {
    // https://on.cypress.io/readfile

    // You can read a file and yield its contents
    // The filePath is relative to your project's root.
    page.FIXME_readFile(Cypress.config('configFile'));
    const config = page;
    expect(config).FIXME_be_an('string');
  });

  test('cy.writeFile() - write to a file', async ({ page }) => {
    // https://on.cypress.io/writefile

    // You can write to a file

    // Use a response from a request to automatically
    // generate a fixture file for use later
    const response = await page.request.get(
      'https://jsonplaceholder.cypress.io/users'
    );
    page.FIXME_fixture('users');
    const users = page;
    expect(users.nth(0).name).FIXME_exist();

    // JavaScript arrays and objects are stringified
    // and formatted into text.
    page.FIXME_writeFile('cypress/fixtures/profile.json', {
      id: 8739,
      name: 'Jane',
      email: 'jane@example.com',
    });
    page.FIXME_fixture('profile');
    const profile = page;
    expect(profile.name).toBe('Jane');
  });
});
