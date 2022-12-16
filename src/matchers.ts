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

import { types as t } from '@babel/core';
import { createUtils } from './utils';

export const locatorMatchers = new Map<string, {
  target: string,
  transform?: (args: t.Expression[], utils: ReturnType<typeof createUtils>) => t.Expression[];
      }>([
        ['be.visible', { target: 'toBeVisible' }],
        ['be.checked', { target: 'toBeChecked' }],
        ['be.disabled', { target: 'toBeDisabled' }],
        ['be.empty', { target: 'toBeEmpty' }],
        ['be.enabled', { target: 'toBeEnabled' }],
        ['be.hidden', { target: 'toBeHidden' }],
        ['contain', { target: 'toHaveText', transform: (args, utils) => {
          return [utils.wrapStringWithRegex(args[0])];
        } }],
        ['have.length', { target: 'toHaveCount' }],
        ['have.text', { target: 'toHaveText' }],
        ['have.value', { target: 'toHaveValue' }],
        ['have.class', { target: 'toHaveClass', transform: (args, utils) => {
          return [utils.wrapStringWithRegex(args[0])];
        } }],
        ['exist', { target: 'toBeVisible' }],
        ['invoke.text.match', { target: 'toHaveText' }],
        ['invoke.val.deep.equal', { target: 'toHaveValues' }],

        // .attr
        ['invoke.attr.equal', { target: 'toHaveAttribute' }],
        ['have.attr', { target: 'toHaveAttribute', transform: (args, utils) => {
          return args.length === 2 ? args : [args[0], t.regExpLiteral('.*')];
        } }],
        ['have.attr.equal', { target: 'toHaveAttribute' }],
        ['have.attr.include', { target: 'toHaveAttribute', transform: (args, utils) => [args[0], utils.wrapStringWithRegex(args[1])] }],
        ['have.attr.match', { target: 'toHaveAttribute', transform: (args, utils) => {
          return [args[0], args[1]];
        } }],

        // .css
        ['invoke.css.equal', { target: 'toHaveCSS' }],
        ['have.css', { target: 'toHaveCSS', transform: (args, utils) => {
          return args.length === 2 ? args : [args[0], t.regExpLiteral('.*')];
        } }],
        ['have.css.equal', { target: 'toHaveCSS' }],
        ['have.css.include', { target: 'toHaveCSS', transform: (args, utils) => [args[0], utils.wrapStringWithRegex(args[1])] }],
        ['have.css.match', { target: 'toHaveCSS', transform: (args, utils) => {
          return [args[0], args[1]];
        } }],

        // .prop
        ['invoke.prop.equal', { target: 'toHaveJSProperty' }],
        ['have.prop', { target: 'toHaveJSProperty' }],
        ['have.prop.equal', { target: 'toHaveJSProperty' }],
        ['have.prop.include', { target: 'toHaveJSProperty', transform: (args, utils) => [args[0], utils.wrapStringWithRegex(args[1])] }],
        ['have.prop.match', { target: 'toHaveJSProperty', transform: (args, utils) => {
          return [args[0], args[1]];
        } }],
      ]);

export const pageMatchers = new Map<string, {
  target: string,
  transform?: (args: t.Expression[], utils: ReturnType<typeof createUtils>) => t.Expression[];
      }>([
        ['url.eq', { target: 'toHaveURL' }],
        ['url.include', { target: 'toHaveURL', transform: (args, utils) => [utils.wrapStringWithRegex(args[0])] }],
        ['url.match', { target: 'toHaveURL' }],

        ['title.eq', { target: 'toHaveTitle' }],
        ['title.include', { target: 'toHaveTitle', transform: (args, utils) => [utils.wrapStringWithRegex(args[0])] }],
        ['title.match', { target: 'toHaveTitle' }],

        ['hash.be.empty', { target: 'toHaveURL', transform: (args, utils) => {
          return [t.regExpLiteral('^[^#]*$')];
        } }],
        ['hash.eq', { target: 'toHaveURL', transform: (args, utils) => {
          return [t.regExpLiteral('#' + utils.escapeForRegex((args[0] as t.StringLiteral).value) + '$')];
        } }],
        ['hash.include', { target: 'toHaveURL', transform: (args, utils) => {
          return [t.regExpLiteral('#.*' + utils.escapeForRegex((args[0] as t.StringLiteral).value))];
        } }],
        ['hash.match', { target: 'toHaveURL', transform: (args, utils) => {
          let pattern = (args[0] as t.RegExpLiteral).pattern;
          pattern = pattern.startsWith('^') ? pattern = pattern.slice(1) : '.*' + pattern;
          return [t.regExpLiteral('.*#' + pattern)];
        } }],

        ['location.pathname.eq', { target: 'toHaveURL', transform: (args, utils) => {
          return [t.regExpLiteral(utils.escapeForRegex('/' + (args[0] as t.StringLiteral).value))];
        } }],
        ['location.pathname.include', { target: 'toHaveURL', transform: (args, utils) => {
          return [t.regExpLiteral(utils.escapeForRegex('/' + (args[0] as t.StringLiteral).value))];
        } }],
        ['location.pathname.match', { target: 'toHaveURL', transform: (args, utils) => {
          let pattern = (args[0] as t.RegExpLiteral).pattern;
          pattern = pattern.startsWith('^') ? pattern = pattern.slice(1) : '.*' + pattern;
          return [t.regExpLiteral('\\/' + pattern)];
        } }],
      ]);

export const valueMatchers = new Map<string, {
  target: string,
}>([
  ['be.gt', { target: 'toBeGreaterThan' }],
  ['be.lt', { target: 'toBeLessThan' }],
  ['be.gte', { target: 'toBeGreaterThanOrEqual' }],
  ['be.lte', { target: 'toBeLessThanOrEqual' }],
  ['deep.equal', { target: 'toEqual' }],
  ['eq', { target: 'toBe' }],
  ['include', { target: 'toContain' }],
]);
