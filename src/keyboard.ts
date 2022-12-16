/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { types as t } from '@babel/core';
import type { BabelAPI } from '@babel/helper-plugin-utils';

export const createKeys = (api: BabelAPI) => {
  const t = api.types;

  const keyMap = new Map<string, string | t.Expression>([
    ['{', ''],
    ['backspace', 'Backspace'],
    ['del', 'Delete'],
    ['downarrow', 'ArrowDown'],
    ['end', 'End'],
    ['enter', 'Enter'],
    ['esc', 'Escape'],
    ['home', 'Home'],
    ['insert', 'Insert'],
    ['leftarrow', 'ArrowLeft'],
    ['movetoend', 'End'],
    ['movetostart', 'Home'],
    ['pagedown', 'PageDown'],
    ['pageup', 'PageUp'],
    ['rightarrow', 'ArrowRight'],
    ['selectall', t.conditionalExpression(
        t.binaryExpression('===',
            t.memberExpression(t.identifier('process'), t.identifier('platform')),
            t.stringLiteral('darwin')),
        t.stringLiteral('Meta+a'),
        t.stringLiteral('Control+a')
    )],
    ['uparrow', 'ArrowUp'],
  ]);

  const modifierMap = new Map<string, string>([
    ['alt', 'Alt'],
    ['ctrl', 'Control'],
    ['control', 'Control'],
    ['cmd', 'Meta'],
    ['command', 'Meta'],
    ['meta', 'Meta'],
    ['option', 'Alt'],
    ['shift', 'Shift'],
  ]);

  return { keyMap, modifierMap };
};
