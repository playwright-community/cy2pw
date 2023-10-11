import { test, expect } from '@playwright/test';

import * as contextmenu from '../../../src/editor/contextmenu.js';

test.describe('contextmenu', function () {
  /**
   * Tear down tests, resetting custom menus.
   * @returns {void}
   */
  test.afterEach(async ({ page }) => {
    contextmenu.resetCustomMenus();
  });

  test('Test svgedit.contextmenu package', async function ({ page }) {
    assert.ok(contextmenu, 'contextmenu registered correctly');
    assert.ok(contextmenu.add, 'add registered correctly');
    assert.ok(
      contextmenu.hasCustomHandler,
      'contextmenu hasCustomHandler registered correctly'
    );
    assert.ok(
      contextmenu.getCustomHandler,
      'contextmenu getCustomHandler registered correctly'
    );
  });

  test('Test svgedit.contextmenu does not add invalid menu item', async function ({
    page,
  }) {
    assert.throws(
      () => contextmenu.add({ id: 'justanid' }),
      null,
      null,
      'menu item with just an id is invalid'
    );

    assert.throws(
      () => contextmenu.add({ id: 'idandlabel', label: 'anicelabel' }),
      null,
      null,
      'menu item with just an id and label is invalid'
    );

    assert.throws(
      () =>
        contextmenu.add({
          id: 'idandlabel',
          label: 'anicelabel',
          action: 'notafunction',
        }),
      null,
      null,
      'menu item with action that is not a function is invalid'
    );
  });

  test('Test svgedit.contextmenu adds valid menu item', async function ({
    page,
  }) {
    const validItem = {
      id: 'valid',
      label: 'anicelabel',
      action() {
        /* empty fn */
      },
    };
    contextmenu.add(validItem);

    assert.ok(
      contextmenu.hasCustomHandler('valid'),
      'Valid menu item is added.'
    );
    assert.equal(
      contextmenu.getCustomHandler('valid'),
      validItem.action,
      'Valid menu action is added.'
    );
  });

  test('Test svgedit.contextmenu rejects valid duplicate menu item id', async function ({
    page,
  }) {
    const validItem1 = {
      id: 'valid',
      label: 'anicelabel',
      action() {
        /* empty fn */
      },
    };
    const validItem2 = {
      id: 'valid',
      label: 'anicelabel',
      action() {
        /* empty fn */
      },
    };
    contextmenu.add(validItem1);

    assert.throws(
      () => contextmenu.add(validItem2),
      null,
      null,
      'duplicate menu item is rejected.'
    );
  });
});
