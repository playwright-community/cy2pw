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
    .name('npx cy2pw')
    .usage('.cypress/ tests/')
    .argument('<src>', 'Source file or folder')
    .argument('<dst>', 'Target file or folder')
    .action((folder, out) => traverse(folder, out));

program.showHelpAfterError();
program.parse();

async function traverse(folder: string, out: string) {
  const stats = await fs.promises.stat(folder);
  if (stats.isFile()) {
    await processFile(folder, out);
    return;
  }

  for (const name of await fs.promises.readdir(folder)) {
    const entry = path.join(folder, name);
    const outEntry = path.join(out, name);
    const stats = await fs.promises.stat(entry);
    if (stats.isDirectory()) {
      await traverse(entry, outEntry);
      continue;
    }
    if (entry.endsWith('cy.js'))
      await processFile(entry, outEntry);
  }
}

async function processFile(fileName: string, out: string) {
  out = out.replace('cy.js', 'spec.ts');
  console.log(`${fileName} -> ${out}`);
  let text = await fs.promises.readFile(fileName, 'utf-8');
  text = text.replace('/// <reference types="cypress" />\n', '');
  const result = await cy2pw(babel as BabelAPI, prettier, text);
  if (!result.text)
    throw new Error(result.error?.message);
  text = result.text;
  await fs.promises.mkdir(path.dirname(out), { recursive: true });
  await fs.promises.writeFile(out, text);
}
