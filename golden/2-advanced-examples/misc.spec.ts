import { test, expect } from '@playwright/test';

test.describe('Misc', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/misc');
  });

  test('.end() - end the command chain', async ({ page }) => {
    // https://on.cypress.io/end

    // cy.end is useful when you want to end a chain of commands
    // and force Cypress to re-query from the root element
    const scope = page.locator('.misc-table');
    // ends the current chain and yields null
    await scope
      .getByText(/Cheryl/)
      .first()
      .click();

    // queries the entire table again
    await scope
      .getByText(/Charles/)
      .first()
      .click();
  });

  test('cy.exec() - execute a system command', async ({ page }) => {
    // execute a system command.
    // so you can take actions necessary for
    // your test outside the scope of Cypress.
    // https://on.cypress.io/exec

    // we can use Cypress.platform string to
    // select appropriate command
    // https://on.cypress/io/platform
    console.log(`Platform ${process.platform} architecture ${process.arch}`);

    // on CircleCI Windows build machines we have a failure to run bash shell
    // https://github.com/cypress-io/cypress/issues/5169
    // so skip some of the tests by passing flag "--env circle=true"
    const isCircleOnWindows =
      process.platform === 'win32' && process.env['circle'];

    if (isCircleOnWindows) {
      console.log('Skipping test on CircleCI');

      return;
    }

    // cy.exec problem on Shippable CI
    // https://github.com/cypress-io/cypress/issues/6718
    const isShippable =
      process.platform === 'linux' && process.env['shippable'];

    if (isShippable) {
      console.log('Skipping test on ShippableCI');

      return;
    }
    page.FIXME_exec('echo Jane Lane');
    await page.stdout.FIXME_should('contain', 'Jane Lane');

    if (process.platform === 'win32') {
      page.FIXME_exec(`print ${Cypress.config('configFile')}`);
      await page.stderr.FIXME_should('be.empty');
    } else {
      page.FIXME_exec(`cat ${Cypress.config('configFile')}`);
      await page.stderr.FIXME_should('be.empty');
      page.FIXME_exec('pwd');
      await expect.poll(async () => page.code).toBe(0);
    }
  });

  test('cy.focused() - get the DOM element that has focus', async ({
    page,
  }) => {
    // https://on.cypress.io/focused
    await page.locator('.misc-form').locator('#name').click();
    page.FIXME_focused();
    await page.FIXME_should('have.id', 'name');
    await page.locator('.misc-form').locator('#description').click();
    page.FIXME_focused();
    await page.FIXME_should('have.id', 'description');
  });

  test.describe('Cypress.Screenshot', function () {
    test('cy.screenshot() - take a screenshot', async ({ page }) => {
      // https://on.cypress.io/screenshot
      page.FIXME_screenshot('my-image');
    });

    test('Cypress.Screenshot.defaults() - change default config of screenshots', async function ({
      page,
    }) {
      Cypress.Screenshot.defaults({
        blackout: ['.foo'],
        capture: 'viewport',
        clip: { x: 0, y: 0, width: 200, height: 200 },
        scale: false,
        disableTimersAndAnimations: true,
        screenshotOnRunFailure: true,
        onBeforeScreenshot() {},
        onAfterScreenshot() {},
      });
    });
  });

  test('cy.wrap() - wrap an object', async ({ page }) => {
    // https://on.cypress.io/wrap
    page.FIXME_wrap({ foo: 'bar' });
    await page.FIXME_should('have.property', 'foo');
    await expect.poll(async () => page).toContain('bar');
  });
});
