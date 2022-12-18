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
import type { NodePath, Visitor } from '@babel/traverse';
import type { types as t } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { createUtils } from './utils';
import { Context, State, SubjectType } from './mapping';
import { createCyMapping } from './mapCy';
import { createExpectMapping } from './mapExpect';

type Entry = {
  method: string;
  path: NodePath<t.CallExpression>;
  breakChain?: boolean;
  propertyName?: string;
};

export const transform = declare((api: BabelAPI) => {
  api.assertVersion(7);
  const t = api.types;

  const aliasTypes: Context['aliasTypes'] = new Map();
  const { CyMapping, pageSubject } = createCyMapping(api);
  const { ExpectMapping } = createExpectMapping(api);
  const cyMapping = new CyMapping();
  const expectMapping = new ExpectMapping();
  const utils = createUtils(api);

  const membersToCallExpressions: (variableName: string) => Visitor = variableName => ({
    MemberExpression(path) {
      if (t.isCallExpression(path.parentPath.node))
        return;
      let object = path.node.object;
      while (true) {
        if (t.isMemberExpression(object)) {
          object = object.object;
          continue;
        }
        if (t.isCallExpression(object)) {
          object = object.callee as t.Expression;
          continue;
        }
        if (t.isIdentifier(object, { name: variableName }))
          break;
        return;
      }

      if (path.node.computed && t.isNumericLiteral(path.node.property)) {
        path.replaceWith(utils.makeSyncCall(path.node.object,'nth', [path.node.property]));
        return;
      }

      if (t.isIdentifier(path.node.property, { name: 'length' })) {
        path.replaceWith(utils.makeAsyncCall(path.node.object, 'count'));
        return;
      }

      if (t.isIdentifier(path.node.property, { name: 'className' })) {
        path.replaceWith(utils.makeAsyncCall(path.node.object, 'getAttribute', [t.stringLiteral('class')]));
        return;
      }
    }
  });

  const visitor: (state: State) => Visitor = state => ({
    BlockStatement(path) {
      if (state.scope)
        path.traverse(membersToCallExpressions((state.scope?.expression as t.Identifier).name));
    },

    CallExpression(path) {
      // Hooks.
      if (prefixWithTest(path, 'describe', false, false))
        return;
      if (prefixWithTest(path, 'context', false, false))
        return;
      for (const fixture of ['beforeEach', 'afterEach']) {
        if (prefixWithTest(path, fixture, true, true))
          return;
      }
      for (const fixture of ['beforeAll', 'afterAll']) {
        if (prefixWithTest(path, fixture, true, false))
          return;
      }

      // Fixtures signature w/skip.
      if (t.isMemberExpression(path.node.callee)
          && t.isIdentifier(path.node.callee.object, { name: 'it' })
          && t.isIdentifier(path.node.callee.property)
          && path.node.arguments[1]
          && (t.isArrowFunctionExpression(path.node.arguments[1]) || t.isFunctionExpression(path.node.arguments[1]))) {
        path.node.callee.object.name = 'test';
        (path.get('arguments.1') as NodePath).traverse(visitor({ variables: new Set() }));
        path.node.arguments[1].async = true;
        path.node.arguments[1].params = [t.objectExpression([
          t.objectProperty(t.identifier('page'), t.identifier('page'), false, true)
        ])] as any;
      }

      // Fixtures signature.
      if (t.isIdentifier(path.node.callee, { name: 'it' })
          && path.node.arguments[1]
          && (t.isArrowFunctionExpression(path.node.arguments[1]) || t.isFunctionExpression(path.node.arguments[1]))) {
        path.node.callee.name = 'test';
        (path.get('arguments.1') as NodePath).traverse(visitor({ variables: new Set() }));
        path.node.arguments[1].async = true;
        path.node.arguments[1].params = [t.objectExpression([
          t.objectProperty(t.identifier('page'), t.identifier('page'), false, true)
        ])] as any;
        return;
      }

      if (utils.isMember(path.node.callee, 'Cypress.env') && t.isStringLiteral(path.node.arguments[0])) {
        (path.node.callee as any).object.name = 'process';
        path.replaceWith(t.memberExpression(path.node.callee as any, path.node.arguments[0], true));
        return;
      }

      const chain = translateCyChain(path, state);
      if (!chain)
        return;
      const { subject, nodes } = chain;

      makeAsync(path);

      // It is a locator chain, replace with new subject.
      if (nodes.length === 0) {
        path.replaceWith(subject.expression);
        path.skip();
        return;
      }

      // Replacing multiple statements outside block - enclose into arrow function.
      const statements = expressionsAsStatements(nodes);
      if (!t.isIdentifier(subject.expression, { name: 'void' }))
        statements.push(t.returnStatement(subject.expression));

      path.replaceWith(t.callExpression(
          t.arrowFunctionExpression(
              [],
              t.blockStatement(statements),
              true,
          ),
          []
      ));
      path.skip();
    },

    ExpressionStatement: {
      enter(path) {
        // Preserve comments via expanding statements, not expressions.
        if (t.isCallExpression(path.node.expression)) {
          const returnValue = translateCyChain(path.get('expression') as NodePath<t.CallExpression>, state);
          if (returnValue) {
            makeAsync(path);
            const statements = expressionsAsStatements(returnValue.nodes);
            path.replaceWithMultiple(statements);
            path.skip();
            return;
          }
        }
      },

      exit(path) {
        const returnValue = translateExpectChain(path.get('expression'), state);
        if (returnValue) {
          makeAsync(path);
          const statements = expressionsAsStatements(returnValue.nodes);
          path.replaceWithMultiple(statements);
          path.skip();
          return;
        }
      }
    },

    MemberExpression(path) {
      if (utils.isMember(path.node, 'Cypress.log')
          || utils.isMember(path.node, 'Cypress.arch')
          || utils.isMember(path.node, 'Cypress.platform')
      ) {
        (path.node.object as t.Identifier).name = 'process';
        return;
      }

      if (t.isIdentifier(path.node.object, { name: 'this' })) {
        path.replaceWith(path.node.property);
        return;
      }
    }
  });

  return {
    name: 'ast-transform', // not required
    visitor: visitor({ variables: new Set() }),
  };

  function prefixWithTest(path: NodePath<t.CallExpression>, fixture: string, makeAsync: boolean, addPageFixture: boolean): boolean {
    if (!t.isIdentifier(path.node.callee))
      return false;
    if (path.node.callee.name !== fixture)
      return false;
    let callback;
    if (path.node.arguments[0] && t.isFunction(path.node.arguments[0]))
      callback = path.node.arguments[0];
    if (path.node.arguments[1] && t.isFunction(path.node.arguments[1]))
      callback = path.node.arguments[1];
    if (!callback)
      return false;
    if (makeAsync)
      callback.async = true;
    if (fixture === 'context')
      fixture = 'describe';
    if (addPageFixture) {
      callback.params = [t.objectExpression([
        t.objectProperty(t.identifier('page'), t.identifier('page'), false, true)
      ])] as any;
    }
    path.replaceWith(
        t.callExpression(
            t.memberExpression(
                t.identifier('test'),
                t.identifier(fixture)
            ), path.node.arguments)
    );
    return true;
  }

  function translateCyChain(path: NodePath<t.CallExpression>, state: State) {
    let entries: Entry[] = [];
    if (!tokenizeCyChain(path, entries, state))
      return null;
    const processed = !!entries.find(e => (e.path.node as any).__processed);
    if (processed)
      return null;
    entries = processCyLigatures(entries);
    return buildChain(entries, cyMapping, state);
  }

  function tokenizeCyChain(path: NodePath<t.CallExpression>, entries: Entry[], state: State): boolean {
    const expression = path.node;
    if (!t.isMemberExpression(expression.callee) || !t.isIdentifier(expression.callee.property))
      return false;

    entries.unshift({
      method: expression.callee.property.name,
      path,
    });

    const objectPath = path.get('callee.object') as NodePath;
    if (objectPath && t.isCallExpression(objectPath.node))
      return tokenizeCyChain(objectPath as NodePath<t.CallExpression>, entries, state);

    if (objectPath && t.isIdentifier(objectPath.node, { name: 'cy' }))
      return true;

    if (state.scope?.type === SubjectType.Locator &&
        t.isIdentifier(objectPath.node, { name: (state.scope?.expression as t.Identifier).name }))
      return true;

    return false;
  }

  function processCyLigatures(entries: Entry[]) {
    const result: Entry[] = [];
    for (let i = 0; i < entries.length; ++i) {
      const entry = entries[i];
      const { path, method } = entry;
      const expression = path.node;

      const followingEntry = entries[i + 1];
      const followingMethod = followingEntry?.method;
      const followingExpression = followingEntry?.path.node;
      const followingIsShould = (followingMethod === 'should' || followingMethod === 'and');

      if (followingIsShould && t.isStringLiteral(followingExpression.arguments[0])) {
        const shouldArg = followingExpression?.arguments[0];
        const isNot = shouldArg.value.startsWith('not.') ? `not.` : '';
        const absMatch = isNot ? shouldArg.value.substring(4) : shouldArg.value;

        if (method === 'invoke') {
          // invoke('text').should('match')
          const functionToInvoke = expression.arguments[0];
          if (expression.arguments.length === 1 && t.isStringLiteral(functionToInvoke)) {
            shouldArg.value = `${isNot}invoke.${functionToInvoke.value}.${absMatch}`;
            continue;
          }
          // invoke('attr', 'href').should('equal', 'value')
          if (expression.arguments.length === 2 && t.isStringLiteral(functionToInvoke)) {
            shouldArg.value = `${isNot}invoke.${functionToInvoke.value}.${absMatch}`;
            followingExpression.arguments = [shouldArg, expression.arguments[1], ...followingExpression.arguments.slice(1)];
            continue;
          }
        }

        // .location('pathname').should('include')
        if (method === 'location') {
          const locationProperty = expression.arguments[0];
          if (t.isStringLiteral(locationProperty)) {
            shouldArg.value = `${isNot}location.${locationProperty.value}.${absMatch}`;
            continue;
          }
          shouldArg.value = `${isNot}location.${absMatch}`;
          continue;
        }

        // .title().should('include')
        if (method === 'title') {
          shouldArg.value = `${isNot}title.${absMatch}`;
          continue;
        }

        // .hash.should('by.empty')
        if (method === 'hash' || method === 'url') {
          shouldArg.value = `${isNot}${method}.${absMatch}`;
          continue;
        }

        // .should('have.attr', 'name').and('include', 'value')
        if ((method === 'should' || method === 'and') && expression.arguments.length === 2
          && (utils.isStringLiteralEqual(expression.arguments[0], 'have.attr')
            || utils.isStringLiteralEqual(expression.arguments[0], 'have.prop'))
          && t.isStringLiteral(expression.arguments[0])
          && t.isStringLiteral(expression.arguments[1])
          && t.isStringLiteral(followingExpression.arguments[0])) {
          shouldArg.value = `${isNot}${expression.arguments[0].value}.${absMatch}`;
          followingExpression.arguments = [shouldArg, expression.arguments[1], ...followingExpression.arguments.slice(1)];
          continue;
        }
      }

      // .invoke('val', 25).trigger('change')
      if (method === 'invoke' && expression.arguments.length > 1 && followingMethod === 'trigger') {
        if (utils.isStringLiteralEqual(expression.arguments[0], 'val')
          && utils.isStringLiteralEqual(followingExpression!.arguments[0], 'change')) {
          entry.method = 'type';
          let arg = entry.path.node.arguments[1];
          if (t.isNumericLiteral(arg))
            arg = t.stringLiteral(String(arg.value));
          entry.path.node.arguments = [arg];
          ++i;
          // It is unsafe to chain to trigger.
          result.push({ ...entry, breakChain: true });
          continue;
        }
      }

      result.push(entry);
    }
    return result;
  }

  function buildChain(entries: Entry[], mapping: any, state: State) {
    const nodes: t.Node[] = [];
    let subject = state.scope || pageSubject;

    for (let i = 0; i < entries.length; ++i) {
      const { path, method, breakChain, propertyName } = entries[i];
      const expression = path.node;
      const context: Context = {
        aliasTypes,
        isLast: i === entries.length - 1,
        path,
        visitor,
        state,
        propertyName,
        method,
      };
      const returnValue = mapping[method]?.(subject, expression.arguments, context)
        || mapping['fallback'](subject, expression.arguments, context);

      subject = breakChain ? pageSubject : returnValue?.subject || subject;
      nodes.push(...(returnValue?.nodes || []));
    }

    return { subject, nodes };
  }

  function translateExpectChain(path: NodePath<t.Expression>, state: State) {
    const entries: Entry[] = [];
    if (!tokenizeExpectChain(path, entries))
      return null;
    const processed = !!entries.find(e => (e.path.node as any).__processed);
    if (processed)
      return null;
    return buildChain(entries, expectMapping, state);
  }

  function tokenizeExpectChain(path: NodePath<t.Expression>, entries: Entry[]): boolean {
    const expression = path.node;
    if (t.isCallExpression(expression)) {
      if (t.isMemberExpression(expression.callee) && t.isIdentifier(expression.callee.property)) {
        entries.unshift({
          method: expression.callee.property.name,
          path: path as NodePath<t.CallExpression>,
        });
        const objectPath = path.get('callee.object') as NodePath;
        return tokenizeExpectChain(objectPath as NodePath<t.CallExpression>, entries);
      }

      if (t.isIdentifier(expression.callee, { name: 'expect' })) {
        if ((expression as any).__processed)
          return false;

        // expect(location.hostname) -> expect(location).property('hostname')
        let argument = expression.arguments[0];
        for (; t.isMemberExpression(argument) && t.isIdentifier(argument.property); argument = argument.object) {
          entries.unshift({
            method: 'property',
            propertyName: argument.property.name,
            path: path as NodePath<t.CallExpression>,
          });
        }
        expression.arguments[0] = argument;
        entries.unshift({
          method: 'expect',
          path: path as NodePath<t.CallExpression>,
        });
        return true;
      }
    }

    if (t.isMemberExpression(expression) && t.isIdentifier(expression.property)) {
      if (!entries.length) {
        // to.be.empty ?
        entries.unshift({
          method: expression.property.name,
          path: path as NodePath<t.CallExpression>,
        });
        const objectPath = path.get('object') as NodePath;
        return tokenizeExpectChain(objectPath as NodePath<t.CallExpression>, entries);
      }
      if (expression.property.name !== 'to' && expression.property.name !== 'and')
        entries[0].method = expression.property.name + '_' + entries[0].method;
      const objectPath = path.get('object') as NodePath;
      return tokenizeExpectChain(objectPath as NodePath<t.CallExpression>, entries);
    }

    return false;
  }

  function makeAsync(path: NodePath) {
    let scope: NodePath | null = path.parentPath;
    while (scope && !t.isFunction(scope.node))
      scope = scope.parentPath;
    if (scope)
      (scope.node as t.FunctionExpression).async = true;
  }

  function expressionsAsStatements(nodes: t.Node[]): t.Statement[] {
    return nodes.map(n => t.isExpression(n) ? t.expressionStatement(n) : n as t.Statement);
  }
});
