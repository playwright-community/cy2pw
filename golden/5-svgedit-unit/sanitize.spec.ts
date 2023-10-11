import { test, expect } from '@playwright/test';

import { NS } from '../../../packages/svgcanvas/core/namespaces.js';
import * as sanitize from '../../../packages/svgcanvas/core/sanitize.js';

test.describe('sanitize', function () {
  const svg = document.createElementNS(NS.SVG, 'svg');

  test('Test sanitizeSvg() strips ws from style attr', async function ({
    page,
  }) {
    const rect = document.createElementNS(NS.SVG, 'rect');
    rect.setAttribute('style', 'stroke: blue ;\t\tstroke-width :\t\t40;');
    // sanitizeSvg() requires the node to have a parent and a document.
    svg.append(rect);
    sanitize.sanitizeSvg(rect);

    assert.equal(rect.getAttribute('stroke'), 'blue');
    assert.equal(rect.getAttribute('stroke-width'), '40');
  });
});
