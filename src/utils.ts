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

export type Arg = t.Expression | t.SpreadElement | t.JSXNamespacedName | t.ArgumentPlaceholder;

export const createUtils = (api: BabelAPI) => {
  const t = api.types;

  class Utils {
    constructor() {}

    makeSyncCall(expression: t.Expression, method: string, args: Arg[] = []) {
      const result = t.callExpression(t.memberExpression(expression, t.identifier(method)), args);
      (result as any).__processed = true;
      return result;
    }

    makeAsyncCall(expression: t.Expression, method: string, args: Arg[] = []) {
      const result = t.awaitExpression(this.makeSyncCall(expression, method, args));
      (result as any).__processed = true;
      return result;
    }

    getProperty(arg: t.ObjectExpression, name: string) {
      const property = arg.properties.find(p => t.isObjectProperty(p) && t.isIdentifier(p.key, { name }));
      return property as t.ObjectProperty;
    }

    getMethod(arg: t.ObjectExpression, name: string) {
      const property = arg.properties.find(p => t.isObjectMethod(p) && t.isIdentifier(p.key, { name }));
      return (property as t.ObjectMethod);
    }

    getBooleanProperty(arg: t.ObjectExpression, name: string): boolean {
      const value = this.getProperty(arg, name)?.value;
      if (value && t.isBooleanLiteral(value))
        return value.value;
      return false;
    }

    wrapStringWithRegex(node: t.Expression) {
      if (t.isStringLiteral(node))
        return t.regExpLiteral(this.escapeForRegex(node.value));
      if (t.isNumericLiteral(node))
        return t.regExpLiteral(String(node.value));
      return node;
    }

    callOptionProperties(args: Arg[], names: string[]): t.ObjectProperty[] {
      const optionsArg = args[args.length - 1];
      if (!t.isObjectExpression(optionsArg))
        return [];
      return names.map(n => this.getProperty(optionsArg, n)).filter(Boolean);
    }

    callOptionPropertyValue(args: Arg[], name: string): t.Expression | undefined {
      return this.callOptionProperties(args, [name])[0]?.value as t.Expression;
    }

    hasCallOption(args: Arg[], name: string): boolean {
      return !!this.callOptionProperties(args, [name]).length;
    }

    callOptions(args: Arg[], names: string[]): t.ObjectExpression[] {
      const properties = this.callOptionProperties(args, names);
      return properties.length ? [t.objectExpression(properties)] : [];
    }

    isMember(node: t.Node, member: string) {
      const [object, property] = member.split('.');
      if (!t.isMemberExpression(node))
        return false;
      if (!t.isIdentifier(node.object, { name: object }))
        return false;
      if (!t.isIdentifier(node.property, { name: property }))
        return false;
      return true;
    }

    isStringLiteralEqual(node: t.Node, value: string): boolean {
      return t.isStringLiteral(node) && node.value === value;
    }

    escapeForRegex(text: string) {
      return text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    }
  }

  return new Utils();
};

export function escapeWithQuotes(text: string, char: string = '\'') {
  const stringified = JSON.stringify(text);
  const escapedText = stringified.substring(1, stringified.length - 1).replace(/\\"/g, '"');
  if (char === '\'')
    return char + escapedText.replace(/[']/g, '\\\'') + char;
  if (char === '"')
    return char + escapedText.replace(/["]/g, '\\"') + char;
  if (char === '`')
    return char + escapedText.replace(/[`]/g, '`') + char;
  throw new Error('Invalid escape char');
}

export function capitalize(name: string): string {
  return name[0].toUpperCase() + name.slice(1);
}
