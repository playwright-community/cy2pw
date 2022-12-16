import { test, expect } from '@playwright/test';

test.describe('Network Requests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.cypress.io/commands/network-requests');
  });

  // Manage HTTP requests in your app

  test('cy.request() - make an XHR request', async ({ page }) => {
    // https://on.cypress.io/request
    await expect(async () => {
      const response = await page.request.get(
        'https://jsonplaceholder.cypress.io/comments'
      );
      expect(response.status()).toBe(200);
      // the server sometimes gets an extra comment posted from another machine
      // which gets returned as 1 extra object
      expect(await response.json()).toHaveProperty('length');
      expect([500, 501]).toContain((await response.json()).length);
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('duration');
    }).toPass();
  });

  test('cy.request() - verify response using BDD syntax', async ({ page }) => {
    const response = await page.request.get(
      'https://jsonplaceholder.cypress.io/comments'
    );

    // https://on.cypress.io/assertions
    expect(response.status()).toBe(200);
    expect(await response.json()).toHaveProperty('length');
    expect([500, 501]).toContain((await response.json()).length);
    expect(response).FIXME_toIncludeKeys('headers', 'duration');
  });

  test('cy.request() with query parameters', async ({ page }) => {
    // will execute request
    // https://jsonplaceholder.cypress.io/comments?postId=1&id=3
    await (
      await page.request.get('https://jsonplaceholder.cypress.io/comments')
    )
      .body()
      .FIXME_should('be.an', 'array');
    await (
      await page.request.get('https://jsonplaceholder.cypress.io/comments')
    )
      .body()
      .FIXME_should('have.length', 1);
    await (
      await page.request.get('https://jsonplaceholder.cypress.io/comments')
    )
      .body()[0]
      .FIXME_should('contain', {
        postId: 1,
        id: 3,
      });
  });

  test('cy.request() - pass result to the second request', async ({ page }) => {
    // first, let's find out the userId of the first user we have
    const user = (
      await page.request.get(
        'https://jsonplaceholder.cypress.io/users?_limit=1'
      )
    ).body()[0];
    expect(user.id).FIXME_toBeA('number');
    // make a new post on behalf of the user
    const response = (
      await page.request.get(
        'https://jsonplaceholder.cypress.io/users?_limit=1'
      )
    ).body()[0];
    expect(response.status).toBe(201); // new entity created
    expect(response.body).toContain({
      title: 'Cypress Test Runner',
    });

    // we don't know the exact post id - only that it will be > 100
    // since JSONPlaceholder has built-in 100 posts
    expect(response.body.id).FIXME_toBeA('number');
    expect(response.body.id).toBeGreaterThan(100);

    // we don't know the user id here - since it was in above closure
    // so in this test just confirm that the property is there
    expect(response.body.userId).FIXME_toBeA('number');
  });

  test('cy.request() - save response in the shared test context', async ({
    page,
  }) => {
    // https://on.cypress.io/variables-and-aliases
    const user = (
      await page.request.get(
        'https://jsonplaceholder.cypress.io/users?_limit=1'
      )
    ).body()[0];

    // NOTE 👀
    //  By the time this callback runs the "as('user')" command
    //  has saved the user object in the test context.
    //  To access the test context we need to use
    //  the "function () { ... }" callback form,
    //  otherwise "this" points at a wrong or undefined object!
    const post = (
      await page.request.post('https://jsonplaceholder.cypress.io/posts')
    ).body();

    // save the new post from the response

    // When this callback runs, both "cy.request" API commands have finished
    // and the test context has "user" and "post" objects set.
    // Let's verify them.
    expect(this.post.userId).toBe(this.user.id);
  });

  test('cy.intercept() - route responses to matching requests', async ({
    page,
  }) => {
    // https://on.cypress.io/intercept

    let message = 'whoa, this comment does not exist';

    // Listen to GET to comments/1
    const getComment = page.waitForResponse('**/comments/*');

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    await page.locator('.network-btn').click();

    // https://on.cypress.io/wait
    await (await getComment).status().FIXME_should('be.oneOf', [200, 304]);

    // Listen to POST to comments
    const postComment = page.waitForResponse('**/comments');

    // we have code that posts a comment when
    // the button is clicked in scripts.js
    await page.locator('.network-post').click();
    await (
      await postComment
    ).FIXME_should(async ({ request, response }) => {
      expect(request.body).toContain('email');
      expect(request.headers).toHaveProperty('content-type');
      expect(response && response.body).toHaveProperty(
        'name',
        'Using POST in cy.intercept()'
      );
    });

    // Stub a response to PUT comments/ ****
    const putComment = page.waitForResponse({
      statusCode: 404,
      body: { error: message },
      headers: { 'access-control-allow-origin': '*' },
      delayMs: 500,
    });

    // we have code that puts a comment when
    // the button is clicked in scripts.js
    await page.locator('.network-put').click();

    // our 404 statusCode logic in scripts.js executed
    await expect(page.locator('.network-put-comment')).toHaveText(message);
  });
});
