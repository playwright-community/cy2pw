import { test, expect } from '@playwright/test';

test.describe('Browser bugs', function () {
  test('removeItem and setAttribute test (Chromium 843901; now fixed)', async function ({
    page,
  }) {
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=843901
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    elem.setAttribute('transform', 'matrix(1,0,0,1,0,0)');
    elem.transform.baseVal.removeItem(0);
    elem.removeAttribute('transform');
    assert.equal(elem.hasAttribute('transform'), false);
  });
});
