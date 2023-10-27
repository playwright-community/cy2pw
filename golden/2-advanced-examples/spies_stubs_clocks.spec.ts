import { test, expect } from '@playwright/test';

// remove no check once Cypress.sinon is typed
// https://github.com/cypress-io/cypress/issues/6720

test.describe('Spies, Stubs, and Clock', () => {
  test('cy.spy() - wrap a method in a spy', async ({ page }) => {
    // https://on.cypress.io/spy
    await page.goto('https://example.cypress.io/commands/spies-stubs-clocks');

    const obj = {
      foo() {},
    };

    const spy = (async () => {
      await spy(page, obj, 'foo');
      const anyArgs = page;
      return page;
    })();

    obj.foo();
    expect(spy).be_called(page);
  });

  test('cy.spy() retries until assertions pass', async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/spies-stubs-clocks');

    const obj = {
      /**
       * Prints the argument passed
       * @param x {any}
       */
      foo(x) {
        /* eslint-disable-next-line no-console */
        console.log('obj.foo called with', x);
      },
    };
    await spy(
      page,

      obj,
      'foo'
    );
    const foo = page;

    setTimeout(() => {
      obj.foo('first');
    }, 500);

    setTimeout(() => {
      obj.foo('second');
    }, 2500);
    await foo.FIXME_should('have.been.calledTwice');
  });

  test('cy.stub() - create a stub and/or replace a function with stub', async ({
    page,
  }) => {
    // https://on.cypress.io/stub
    await page.goto('https://example.cypress.io/commands/spies-stubs-clocks');

    const obj = {
      /**
       * prints both arguments to the console
       * @param a {string}
       * @param b {string}
       */
      foo(a, b) {
        // eslint-disable-next-line no-console
        console.log('a', a, 'b', b);
      },
    };

    const stub = (async () => {
      await stub(page, obj, 'foo');
      const foo = page;
      return page;
    })();

    obj.foo('foo', 'bar');
    expect(stub).be_called(page);
  });

  test('cy.clock() - control time in the browser', async ({ page }) => {
    // https://on.cypress.io/clock

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime();
    await clock(
      page,

      now
    );
    await page.goto('https://example.cypress.io/commands/spies-stubs-clocks');
    await page.locator('#clock-div').click();
    await expect(page.locator('#clock-div')).toHaveText('1489449600');
  });

  test('cy.tick() - move time in the browser', async ({ page }) => {
    // https://on.cypress.io/tick

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime();
    await clock(
      page,

      now
    );
    await page.goto('https://example.cypress.io/commands/spies-stubs-clocks');
    await page.locator('#tick-div').click();
    await expect(page.locator('#tick-div')).toHaveText('1489449600');
    await tick(
      page,

      10000
    ); // 10 seconds passed
    await page.locator('#tick-div').click();
    await expect(page.locator('#tick-div')).toHaveText('1489449610');
  });

  test('cy.stub() matches depending on arguments', async ({ page }) => {
    // see all possible matchers at
    // https://sinonjs.org/releases/latest/matchers/
    const greeter = {
      /**
       * Greets a person
       * @param {string} name
       */
      greet(name) {
        return `Hello, ${name}!`;
      },
    };
    await stub(
      page,

      greeter,
      'greet'
    );
    await callThrough(page);
    await withArgs(
      page,

      Cypress.sinon.match.string
    );
    await returns(page, 'Hi');
    await withArgs(page, Cypress.sinon.match.number);
    await throws(page, new Error('Invalid name'));
    expect(greeter.greet('World')).toBe('Hi');
    expect(() => greeter.greet(42)).throw(page, 'Invalid name');
    expect(greeter.greet).have_been_calledTwice(page);

    // non-matched calls goes the actual method
    expect(greeter.greet()).toBe('Hello, undefined!');
  });

  test('matches call arguments using Sinon matchers', async ({ page }) => {
    // see all possible matchers at
    // https://sinonjs.org/releases/latest/matchers/
    const calculator = {
      /**
       * returns the sum of two arguments
       * @param a {number}
       * @param b {number}
       */
      add(a, b) {
        return a + b;
      },
    };

    const spy = (async () => {
      await spy(page, calculator, 'add');
      const add = page;
      return page;
    })();
    expect(calculator.add(2, 3)).toBe(5);

    // if we want to assert the exact values used during the call
    expect(spy).be_calledWith(page, 2, 3);

    // let's confirm "add" method was called with two numbers
    expect(spy).be_calledWith(
      page,
      Cypress.sinon.match.number,
      Cypress.sinon.match.number
    );

    // alternatively, provide the value to match
    expect(spy).be_calledWith(
      page,
      Cypress.sinon.match(2),
      Cypress.sinon.match(3)
    );

    // match any value
    expect(spy).be_calledWith(page, Cypress.sinon.match.any, 3);

    // match any value from a list
    expect(spy).be_calledWith(page, Cypress.sinon.match.in([1, 2, 3]), 3);

    /**
     * Returns true if the given number is even
     * @param {number} x
     */
    const isEven = (x) => x % 2 === 0;

    // expect the value to pass a custom predicate function
    // the second argument to "sinon.match(predicate, message)" is
    // shown if the predicate does not pass and assertion fails
    expect(spy).be_calledWith(page, Cypress.sinon.match(isEven, 'isEven'), 3);

    /**
     * Returns a function that checks if a given number is larger than the limit
     * @param {number} limit
     * @returns {(x: number) => boolean}
     */
    const isGreaterThan = (limit) => (x) => x > limit;

    /**
     * Returns a function that checks if a given number is less than the limit
     * @param {number} limit
     * @returns {(x: number) => boolean}
     */
    const isLessThan = (limit) => (x) => x < limit;

    // you can combine several matchers using "and", "or"
    expect(spy).be_calledWith(
      page,
      Cypress.sinon.match.number,
      Cypress.sinon
        .match(isGreaterThan(2), '> 2')
        .and(Cypress.sinon.match(isLessThan(4), '< 4'))
    );
    expect(spy).be_calledWith(
      page,
      Cypress.sinon.match.number,
      Cypress.sinon
        .match(isGreaterThan(200), '> 200')
        .or(Cypress.sinon.match(3))
    );

    // matchers can be used from BDD assertions
    await add.FIXME_should(
      'have.been.calledWith',
      Cypress.sinon.match.number,
      Cypress.sinon.match(3)
    );

    // you can alias matchers for shorter test code
    const { match: M } = Cypress.sinon;
    await add.FIXME_should('have.been.calledWith', M.number, M(3));
  });
});
