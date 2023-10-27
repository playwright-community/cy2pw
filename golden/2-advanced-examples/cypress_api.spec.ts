import { test, expect } from '@playwright/test';

test.describe('Cypress.Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  // https://on.cypress.io/custom-commands

  test('.add() - create a custom command', async ({ page }) => {
    Cypress.Commands.add(
      'console',
      {
        prevSubject: true,
      },
      (subject, method) => {
        // the previous subject is automatically received
        // and the commands arguments are shifted

        // allow us to change the console method used
        method = method || 'log';

        // log the subject to the console
        // eslint-disable-next-line no-console
        console[method]('The subject is', subject);

        // whatever we return becomes the new subject
        // we don't want to change the subject so
        // we return whatever was passed in
        return subject;
      }
    );

    // eslint-disable-next-line no-unused-vars
    page.locator('button').FIXME_console('info');
    const $button = page.locator('button');
  });
});

test.describe('Cypress.Cookies', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  // https://on.cypress.io/cookies
  test('.debug() - enable or disable debugging', async ({ page }) => {
    Cypress.Cookies.debug(true);

    // Cypress will now log in the console when
    // cookies are set or cleared
    await page
      .context()
      .addCookies([{ name: 'fakeCookie', value: '123ABC', url: page.url() }]);
    await clearCookie(page, 'fakeCookie');
    await page
      .context()
      .addCookies([{ name: 'fakeCookie', value: '123ABC', url: page.url() }]);
    await clearCookie(page, 'fakeCookie');
    await page
      .context()
      .addCookies([{ name: 'fakeCookie', value: '123ABC', url: page.url() }]);
  });

  test('.preserveOnce() - preserve cookies by key', async ({ page }) => {
    // normally cookies are reset after each test
    const cookie = (await page.context().cookies()).find(
      (c) => c.name === 'fakeCookie'
    );
    await cookie.FIXME_should('not.be.ok');

    // preserving a cookie will not clear it when
    // the next test starts
    await page
      .context()
      .addCookies([{ name: 'lastCookie', value: '789XYZ', url: page.url() }]);
    Cypress.Cookies.preserveOnce('lastCookie');
  });

  test('.defaults() - set defaults for all cookies', async ({ page }) => {
    // now any cookie with the name 'session_id' will
    // not be cleared before each new test runs
    Cypress.Cookies.defaults({
      preserve: 'session_id',
    });
  });
});

test.describe('Cypress.arch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Get CPU architecture name of underlying OS', async ({ page }) => {
    // https://on.cypress.io/arch
    expect(process.arch).exist(page);
  });
});

test.describe('Cypress.config()', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Get and set configuration options', async ({ page }) => {
    // https://on.cypress.io/config
    let myConfig = Cypress.config();
    expect(myConfig).toHaveProperty('animationDistanceThreshold', 5);
    expect(myConfig).toHaveProperty('baseUrl', null);
    expect(myConfig).toHaveProperty('defaultCommandTimeout', 4000);
    expect(myConfig).toHaveProperty('requestTimeout', 5000);
    expect(myConfig).toHaveProperty('responseTimeout', 30000);
    expect(myConfig).toHaveProperty('viewportHeight', 660);
    expect(myConfig).toHaveProperty('viewportWidth', 1000);
    expect(myConfig).toHaveProperty('pageLoadTimeout', 60000);
    expect(myConfig).toHaveProperty('waitForAnimations', true);
    expect(Cypress.config('pageLoadTimeout')).toBe(60000);

    // this will change the config for the rest of your tests!
    Cypress.config('pageLoadTimeout', 20000);
    expect(Cypress.config('pageLoadTimeout')).toBe(20000);

    Cypress.config('pageLoadTimeout', 60000);
  });
});

test.describe('Cypress.dom', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  // https://on.cypress.io/dom
  test('.isHidden() - determine if a DOM element is hidden', async ({
    page,
  }) => {
    let hiddenP = Cypress.$('.dom-p p.hidden').get(0);
    let visibleP = Cypress.$('.dom-p p.visible').get(0);

    // our first paragraph has css class 'hidden'
    expect(Cypress.dom.isHidden(hiddenP)).toBeTruthy();
    expect(Cypress.dom.isHidden(visibleP)).be_false(page);
  });
});

test.describe('Cypress.env()', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  // We can set environment variables for highly dynamic values

  // https://on.cypress.io/environment-variables
  test('Get environment variables', async ({ page }) => {
    // https://on.cypress.io/env
    // set multiple environment variables
    Cypress.env({
      host: 'veronica.dev.local',
      api_server: 'http://localhost:8888/v1/',
    });

    // get environment variable
    expect(process.env['host']).toBe('veronica.dev.local');

    // set environment variable
    process.env['api_server'];
    expect(process.env['api_server']).toBe('http://localhost:8888/v2/');

    // get all environment variable
    expect(Cypress.env()).toHaveProperty('host', 'veronica.dev.local');
    expect(Cypress.env()).toHaveProperty(
      'api_server',
      'http://localhost:8888/v2/'
    );
  });
});

test.describe('Cypress.log', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Control what is printed to the Command Log', async ({ page }) => {
    // https://on.cypress.io/cypress-log
  });
});

test.describe('Cypress.platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Get underlying OS name', async ({ page }) => {
    // https://on.cypress.io/platform
    expect(process.platform).be_exist(page);
  });
});

test.describe('Cypress.version', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Get current version of Cypress being run', async ({ page }) => {
    // https://on.cypress.io/version
    expect(Cypress.version).be_exist(page);
  });
});

test.describe('Cypress.spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/cypress-api');
  });

  test('Get current spec information', async ({ page }) => {
    // https://on.cypress.io/spec
    // wrap the object so we can inspect it easily by clicking in the command log
    await Cypress.spec.FIXME_should('include.keys', [
      'name',
      'relative',
      'absolute',
    ]);
  });
});
