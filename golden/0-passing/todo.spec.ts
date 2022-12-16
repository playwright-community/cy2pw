import { test, expect } from '@playwright/test';

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

test.describe('example to-do app', () => {
  test.beforeEach(async ({ page }) => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    await page.goto('https://example.cypress.io/todo');
  });

  test('displays two todo items by default', async ({ page }) => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    await expect(page.locator('.todo-list li')).toHaveCount(2);

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    await expect(page.locator('.todo-list li').first()).toHaveText(
      'Pay electric bill'
    );
    await expect(page.locator('.todo-list li').last()).toHaveText(
      'Walk the dog'
    );
  });

  test('can add new todo items', async ({ page }) => {
    // We'll store our item text in a variable so we can reuse it
    const newItem = 'Feed the cat';

    // Let's get the input element and use the `type` command to
    // input our new list item. After typing the content of our item,
    // we need to type the enter key as well in order to submit the input.
    // This input has a data-test attribute so we'll use that to select the
    // element in accordance with best practices:
    // https://on.cypress.io/selecting-elements
    await page.locator('[data-test=new-todo]').fill(newItem);
    await page.locator('[data-test=new-todo]').press('Enter');

    // Now that we've typed our new item, let's check that it actually was added to the list.
    // Since it's the newest item, it should exist as the last element in the list.
    // In addition, with the two default items, we should have a total of 3 elements in the list.
    // Since assertions yield the element that was asserted on,
    // we can chain both of these assertions together into a single statement.
    await expect(page.locator('.todo-list li')).toHaveCount(3);
    await expect(page.locator('.todo-list li').last()).toHaveText(newItem);
  });

  test('can check off an item as completed', async ({ page }) => {
    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.
    await page
      .getByText(/Pay electric bill/)
      .first()
      .locator('..')
      .locator('input[type=checkbox]')
      .check();

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    await expect(
      page
        .locator('li')
        .filter({ has: page.getByText(/Pay electric bill/).first() })
    ).toHaveClass(/completed/);
  });

  test.describe('with a checked task', () => {
    test.beforeEach(async ({ page }) => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      await page
        .getByText(/Pay electric bill/)
        .first()
        .locator('..')
        .locator('input[type=checkbox]')
        .check();
    });

    test('can filter for uncompleted tasks', async ({ page }) => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      await page
        .getByText(/Active/)
        .first()
        .click();

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      await expect(page.locator('.todo-list li')).toHaveCount(1);
      await expect(page.locator('.todo-list li').first()).toHaveText(
        'Walk the dog'
      );

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      await expect(
        page.getByText(/Pay electric bill/).first()
      ).not.toBeVisible();
    });

    test('can filter for completed tasks', async ({ page }) => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      await page
        .getByText(/Completed/)
        .first()
        .click();
      await expect(page.locator('.todo-list li')).toHaveCount(1);
      await expect(page.locator('.todo-list li').first()).toHaveText(
        'Pay electric bill'
      );
      await expect(page.getByText(/Walk the dog/).first()).not.toBeVisible();
    });

    test('can delete all completed tasks', async ({ page }) => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      await page
        .getByText(/Clear completed/)
        .first()
        .click();

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      await expect(page.locator('.todo-list li')).toHaveCount(1);
      await expect(page.locator('.todo-list li')).not.toHaveText(
        'Pay electric bill'
      );

      // Finally, make sure that the clear button no longer exists.
      await expect(page.getByText(/Clear completed/).first()).not.toBeVisible();
    });
  });
});
