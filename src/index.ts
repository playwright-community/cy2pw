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

import { transform } from './transform';
import { BabelAPI } from '@babel/helper-plugin-utils';

type Result = {
  text?: string;
  error?: { message: string, line: number, column: number };
};

export default function(api: BabelAPI, prettier: any, text: string, plugins?: any): Result {
  try {
    text = api.transform(text, {
      plugins: [transform],
      retainLines: true,
    })!.code!;
  } catch (e: any) {
    if (!e.loc)
      throw e;
    return {
      error: {
        message: e.message.split('\n')[0],
        line: e.loc.line,
        column: e.loc.column
      }
    };
  }

  if (text.includes('test('))
    text = `import { test, expect } from '@playwright/test';\n\n${text}\n`;

  try {
    text = prettier.format(text, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
      plugins
    });
  } catch (e) {
    console.log(e);
  }
  return { text };
}
