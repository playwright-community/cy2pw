import { test, expect } from '@playwright/test';

test.describe('find* dom-testing-library commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/data/resources/index.html');
  });

  // Test each of the types of queries: LabelText, PlaceholderText, Text, DisplayValue, AltText, Title, Role, TestId

  test('findByLabelText', async ({ page }) => {
    await page.getByLabel('Label 1').click();
    await page.getByLabel('Label 1').fill('Hello Input Labelled By Id');
  });

  test('findAllByLabelText', async ({ page }) => {
    await expect(page.getByLabel(/^Label \d$/)).toHaveCount(2);
  });

  test('findByPlaceholderText', async ({ page }) => {
    await page.getByPlaceholder('Input 1').click();
    await page.getByPlaceholder('Input 1').fill('Hello Placeholder');
  });

  test('findAllByPlaceholderText', async ({ page }) => {
    await expect(page.getByPlaceholder(/^Input \d$/)).toHaveCount(2);
  });

  test('findAllByText', async ({ page }) => {
    await expect(page.getByText(/^Button Text \d$/)).toHaveCount(2);
  });

  test('findByAltText', async ({ page }) => {
    await page.getByAltText('Image Alt Text 1').click();
  });

  test('findAllByAltText', async ({ page }) => {
    await expect(page.getByAltText(/^Image Alt Text \d$/)).toHaveCount(2);
  });

  test('findByTitle', async ({ page }) => {
    await page.getByTitle('Title 1').click();
  });

  test('findAllByTitle', async ({ page }) => {
    await expect(page.getByTitle(/^Title \d$/)).toHaveCount(2);
  });

  test('findByRole', async ({ page }) => {
    await page.getByRole('dialog').click();
  });

  test('findByTestId', async ({ page }) => {
    await page.getByTestId('image-with-random-alt-tag-1').click();
  });

  /* Test the behaviour around these queries */

  test('findByText should handle non-existence', async ({ page }) => {
    await expect(page.getByText('Does Not Exist')).not.toBeVisible();
  });

  test('findByText should handle eventual existence', async ({ page }) => {
    await expect(page.getByText('Eventually Exists')).toBeVisible();
  });

  test('findByText should handle eventual non-existence', async ({ page }) => {
    await expect(page.getByText('Eventually Not exists')).not.toBeVisible();
  });

  test("findByText with should('not.exist')", async ({ page }) => {
    await expect(
      page.getByText('Non-existing Button Text', { timeout: 100 })
    ).not.toBeVisible();
  });

  test('findByText with a previous subject', async ({ page }) => {
    await expect(
      page.locator('#nested').getByText('Button Text 1')
    ).not.toBeVisible();
    await expect(
      page.locator('#nested').getByText('Button Text 2')
    ).toBeVisible();
  });

  test('findByText within', async ({ page }) => {
    const scope = page.locator('#nested');
    await expect(scope.getByText('Button Text 1')).not.toBeVisible();
    await expect(scope.getByText('Button Text 2')).toBeVisible();
  });

  test('findByText in container', async ({ page }) => {
    const subject = page.locator('#nested');
    await expect(subject.getByText('Button Text 1')).not.toBeVisible();
    await expect(subject.getByText('Button Text 2')).toBeVisible();
  });

  test('findByText works when another page loads', async ({ page }) => {
    await page.getByText('Next Page').click();
    await expect(page.getByText('New Page Loaded')).toBeVisible();
  });
});
