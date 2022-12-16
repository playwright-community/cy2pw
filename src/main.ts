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

import type { BabelAPI } from '@babel/helper-plugin-utils';

import * as babel from '@babel/core';
import fs from 'fs';
import path from 'path';
import cy2pw from '.';
import prettier from 'prettier';
import { program } from 'commander';

const packageJSON = require('../package.json');
program
    .version('Version ' + packageJSON.version)
    .name('cy2pw')
    .usage('<folder> <out>')
    .argument('<folder>', 'Source folder, usually cypress/')
    .argument('<out>', 'Target folder, usually tests/')
    .action((folder, out) => traverse(folder, out));

program.showHelpAfterError();
program.parse();

function traverse(folder: string, out: string) {
  for (const name of fs.readdirSync(folder)) {
    const entry = path.join(folder, name);
    const outEntry = path.join(out, name);
    if (fs.statSync(entry).isDirectory()) {
      traverse(entry, outEntry);
      continue;
    }
    if (entry.endsWith('cy.js'))
      processFile(entry, outEntry);
  }
}

function processFile(fileName: string, out: string) {
  console.log(fileName);
  let text = fs.readFileSync(fileName, 'utf-8');
  text = text.replace('/// <reference types="cypress" />\n', '');
  const result = cy2pw(babel as BabelAPI, prettier, text);
  if (!result.text)
    throw new Error(result.error?.message);
  text = result.text;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out.replace('cy.js', 'spec.ts'), text);
}
