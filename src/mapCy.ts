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

import type { NodePath, types as t } from '@babel/core';
import type { BabelAPI } from '@babel/helper-plugin-utils';
import type { Context, Subject } from './mapping';
import { httpMethods, httpMethodsWithShortcut } from './http';
import { createKeys } from './keyboard';
import { createMapping, SubjectType, ReturnValue } from './mapping';
import { locatorMatchers, pageMatchers, valueMatchers } from './matchers';
import { Arg, createUtils } from './utils';
import { deviceViewports } from './viewports';

export const createCyMapping = (api: BabelAPI) => {
  const t = api.types;
  const utils = createUtils(api);
  const { keyMap, modifierMap } = createKeys(api);
  const { createSubject, wrap, returnSyncFixme, returnAsyncFixme, createScopeVariable } = createMapping(api);

  const voidSubject = createSubject(SubjectType.Void, t.identifier('void'));
  const pageSubject = createSubject(SubjectType.Page, t.identifier('page'));
  const expectPollCall = (expression: t.Expression, isNot: boolean) => {
    const call = createSubject(SubjectType.Void, utils.makeSyncCall(
        t.identifier('expect'),
        'poll',
        [
          t.arrowFunctionExpression([], expression, true)
        ]
    ));
    return isNot ? call.member('not', SubjectType.Void) : call;
  };
  const expectToPass = (body: t.Expression | t.BlockStatement, isNot: boolean) => {
    let callee = createSubject(SubjectType.Void, t.callExpression(
        t.identifier('expect'),
        [
          t.arrowFunctionExpression([], body, true)
        ]
    ));
    if (isNot)
      callee = callee.member('not', SubjectType.Void);
    return callee.callAsync('toPass');
  };

  class CyMapping {
    constructor() {
    }

    fallback(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (subject.type === SubjectType.Locator || subject.type === SubjectType.Page)
        return returnSyncFixme(subject, context.method, args);
      return wrap(subject.chain(context.method, args, SubjectType.Value));
    }

    and(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this.should(subject, args, context);
    }

    as(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const alias = (args[0] as t.StringLiteral).value;
      context.aliasTypes.set(alias, subject.type);
      return wrap(subject, t.variableDeclaration(
          'const',
          [
            t.variableDeclarator(
                t.identifier(alias),
                t.cloneDeepWithoutLoc(subject.expression)
            )
          ]
      ));
    }

    blur(subject: Subject, args: t.Expression[]) {
      if (!args.length)
        return wrap(subject, subject.callAsync('blur'));
    }

    check(subject: Subject, args: t.Expression[]) {
      return this._check('check', subject, args);
    }

    children(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(this._locator(subject, args[0] || t.stringLiteral(':scope > *'), context));
    }

    clear(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject, subject.callAsync('clear'));
    }

    click(subject: Subject, args: t.Expression[]): ReturnValue {
      return this._click('click', subject, args);
    }

    closest(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'closest', args, true);
    }

    contains(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (subject.type !== SubjectType.Locator && subject.type !== SubjectType.Page)
        return returnSyncFixme(subject, 'contains', args, false);

      const options = t.isObjectExpression(args[args.length - 1]) ? args[args.length - 1] : undefined;
      if (options)
        args.pop();

      subject = this._locatorSubject(subject, context);
      const [arg1, arg2] = args;
      if (arg2) {
        // contains(selector, content)
        subject = subject.chain('locator', [
          arg1,
          t.objectExpression([
            t.objectProperty(
                t.identifier('hasText'),
                utils.wrapStringWithRegex(arg2))
          ])
        ], SubjectType.Locator);
      } else {
        // contains(content)
        subject = subject.chain('getByText', [utils.wrapStringWithRegex(arg1)], SubjectType.Locator);
      }

      // As per documentation, contains() finds the first element containing some text.
      subject = subject.chain('first', [], SubjectType.Locator);

      // If contains is last in the chain, we convert it into toBeVisible, otherwise,
      // we assume it is followed with an action or assertion.
      if (!context.isLast)
        return wrap(subject);
      return wrap(
          subject,
          this.should(subject, [t.stringLiteral('be.visible')], context).nodes);
    }

    dblclick(subject: Subject, args: t.Expression[]): ReturnValue {
      return this._click('dblclick', subject, args);
    }

    end(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject);
    }

    filter(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (t.isStringLiteral(args[0]))
        return wrap(this._locator(subject, t.stringLiteral(args[0].value + ':scope'), context));
      return returnSyncFixme(subject, 'closes', args, true);
    }

    first(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject.chain('first', [], SubjectType.Locator));
    }

    find(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(this._locator(subject, args[0], context));
    }

    _findBy(subject: Subject, method: string, args: t.Expression[], context: Context): ReturnValue {
      const container = utils.callOptionPropertyValue(args, 'container');
      const containerSubject = container ? createSubject(SubjectType.Locator, container) : undefined;
      if (containerSubject)
        args.pop();
      return wrap(this._locatorSubject(containerSubject || subject, context).chain(method, args, SubjectType.Locator));
    }

    findAllByDisplayValue(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(this._locatorSubject(subject, context).chain('FIXME_findAllByDisplayValue', args, SubjectType.Locator));
    }

    findAllByLabelText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByLabel', args, context);
    }

    findAllByPlaceholderText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByPlaceholder', args, context);
    }

    findAllByAltText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByAltText', args, context);
    }

    findAllByRole(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByRole', args, context);
    }

    findAllByTestId(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByTestId', args, context);
    }

    findAllByText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByText', args, context);
    }

    findAllByTitle(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByTitle', args, context);
    }

    findByDisplayValue(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(this._locatorSubject(subject, context).chain('FIXME_findByDisplayValue', args, SubjectType.Locator));
    }

    findByLabelText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByLabel', args, context);
    }

    findByPlaceholderText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByPlaceholder', args, context);
    }

    findByAltText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByAltText', args, context);
    }

    findByRole(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByRole', args, context);
    }

    findByTestId(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByTestId', args, context);
    }

    findByText(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByText', args, context);
    }

    findByTitle(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._findBy(subject, 'getByTitle', args, context);
    }

    focus(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject, subject.callAsync('focus'));
    }

    get(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const [arg1] = args;
      if (t.isStringLiteral(arg1) && arg1.value.startsWith('@'))
        subject = createSubject(SubjectType.Locator, t.identifier(arg1.value.substring(1)));
      else
        subject = this._locator(pageSubject, args[0], context);

      if (!context.isLast)
        return wrap(subject);
      return wrap(
          subject,
          this.should(subject, [t.stringLiteral('be.visible')], context).nodes);
    }

    go(subject: Subject, args: t.Expression[]): ReturnValue {
      const [arg1] = args;
      const windowSubject = createSubject(SubjectType.Window, t.identifier('window'));
      if (t.isStringLiteral(arg1)) {
        if (arg1.value === 'back')
          return wrap(windowSubject, subject.callAsync('goBack'));
        if (arg1.value === 'forward')
          return wrap(windowSubject, subject.callAsync('goForward'));
        throw new Error('Internal error: Unknown go: ' + arg1.value);
      }
      if (t.isNumericLiteral(arg1))
        return wrap(windowSubject, new Array(arg1.value).fill(0).map(() => subject.callAsync('goForward')));
      if (t.isUnaryExpression(arg1) && t.isNumericLiteral(arg1.argument))
        return wrap(windowSubject, new Array(arg1.argument.value).fill(0).map(() => subject.callAsync('goBack')));
      return returnAsyncFixme(subject, 'go', args);
    }

    location(subject: Subject, args: t.Expression[]): ReturnValue {
      const [arg1] = args;
      const url: t.Node = t.newExpression(t.identifier('URL'), [pageSubject.callSync('url')]);
      const urlSubject = createSubject(SubjectType.URL, url, 1);
      if (arg1)
        wrap(urlSubject.member((arg1 as t.StringLiteral).value, SubjectType.String));
      return wrap(urlSubject);
    }

    intercept(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject.chain('waitForResponse', args.slice(1), SubjectType.Response));
    }

    invoke(subject: Subject, args: t.Expression[]): ReturnValue {
      if (args.length === 2)
        return this._invokeSet(subject, args);
      if (args.length === 1)
        return this._invokeGet(subject, args);
      return returnSyncFixme(subject, 'invoke', args);
    }

    _invokeGet(subject: Subject, args: t.Expression[]): ReturnValue {
      const [arg1] = args;
      const command = (arg1 as t.StringLiteral).value;
      if (command === 'val')
        return wrap(subject.chain('inputValue', [], SubjectType.String));
      return returnAsyncFixme(subject, 'invoke', args);
    }

    _invokeSet(subject: Subject, args: t.Expression[]): ReturnValue {
      const [arg1, arg2] = args;
      const command = (arg1 as t.StringLiteral).value;
      if (command === 'val') {
        const inputParam = t.identifier('input');
        return wrap(subject, subject.callAsync('evaluate', [
          t.arrowFunctionExpression(
              [
                inputParam,
                t.identifier('value')
              ],
              t.assignmentExpression(
                  '=',
                  t.memberExpression(t.identifier('input'), t.identifier('value')),
                  t.callExpression(t.identifier('String'), [t.identifier('value')])
              )
          ),
          arg2
        ]));
      }
      return returnAsyncFixme(subject, 'invoke', args);
    }

    its(subject: Subject, args: t.Expression[]): ReturnValue {
      if (!t.isStringLiteral(args[0]))
        return returnSyncFixme(subject, 'its', args);

      if (subject.type === SubjectType.Locator) {
        if (args[0].value === 'length')
          return wrap(subject.chain('count', [], SubjectType.Value));
      }

      if (subject.type === SubjectType.Response) {
        let expression = args[0].value;
        if (expression.startsWith('response.'))
          expression = expression.substring('response.'.length);
        if (expression === 'statusCode')
          expression = 'status';
        return wrap(createSubject(SubjectType.Value, t.callExpression(
            t.memberExpression(subject.expression, t.identifier(expression)),
            []
        ), subject.depth + 1));
      }

      return wrap(subject.member(args[0].value, SubjectType.Value));
    }

    last(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject.chain('last', [], SubjectType.Locator));
    }

    log(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject, utils.makeSyncCall(t.identifier('console'), 'log', args));
    }

    next(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'next', args, true);
    }

    nextAll(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'nextAll', args, true);
    }

    nextUntil(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'nextUntil', args, true);
    }

    not(subject: Subject, args: t.Expression[]): ReturnValue {
      if (t.isStringLiteral(args[0]))
        return wrap(subject.chain('locator', [t.stringLiteral(`:scope:not(${args[0].value})`)], SubjectType.Locator));
      return returnSyncFixme(subject, 'not', args, true);
    }

    eq(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject.chain('nth', args, SubjectType.Locator));
    }

    parent(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      // get('a').find('b').parent() => locator('a').locator('b').locator(..)
      if (!args.length)
        return wrap(this._locator(subject, t.stringLiteral('..'), context));

      // get('a').find('b').parent('p') => locator('p').filter({ has: locator(':scope > a').locator('b') })
      const parentSubject = this._locator(pageSubject, args[0], context)
          .chain('filter', [
            t.objectExpression([
              t.objectProperty(t.identifier('has'), subject.expression)
            ])
          ], SubjectType.Locator);
      return wrap(parentSubject);
    }

    parents(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      // get('a').find('b').parents() => locator('*', { has: locator('a').locator('b') })
      if (!args.length) {
        const parentSubject = this._locator(pageSubject, t.stringLiteral('*'), context)
            .chain('filter', [
              t.objectExpression([
                t.objectProperty(t.identifier('has'), subject.expression)
              ])
            ], SubjectType.Locator);
        return wrap(parentSubject);
      }

      // get('a').find('b').parents('p') => locator('p', { has: locator('a').locator('b') })
      const parentSubject = this._locator(pageSubject, args[0], context)
          .chain('filter', [
            t.objectExpression([
              t.objectProperty(t.identifier('has'), subject.expression)
            ])
          ], SubjectType.Locator);
      return wrap(parentSubject);
    }

    parentsUntil(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      // get('a').find('b').parentsUntil('p') => locator('p *', { has: locator('a').locator('b') })
      if (!t.isStringLiteral(args[0]))
        return returnSyncFixme(subject, 'parentsUntil', args, true);

      const parentSubject = this._locator(pageSubject, t.stringLiteral(args[0].value + ' *'), context)
          .chain('filter', [
            t.objectExpression([
              t.objectProperty(t.identifier('has'), subject.expression)
            ])
          ], SubjectType.Locator);
      return wrap(parentSubject);
    }

    prev(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'prev', args, true);
    }

    prevAll(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'prevAll', args, true);
    }

    prevUntil(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'prevUntil', args, true);
    }

    reload(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject, subject.callAsync('reload'));
    }

    request(subject: Subject, args: t.Expression[]): ReturnValue {
      // .request(url)
      // .request(url, body)
      // .request(method, url)
      // .request(method, url, body)
      // .request(options)
      let method: string = 'GET';
      if (t.isStringLiteral(args[0]) && httpMethods.has(args[0].value.toUpperCase())) {
        method = args[0].value;
        args = args.slice(1);
      }

      // .request(url)
      // .request(url, body)
      // .request(options)
      let url: Arg;
      if (t.isStringLiteral(args[0])) {
        // url
        url = args[0];
      } else if (t.isObjectExpression(args[0])) {
        // options
        url = utils.getProperty(args[0], 'url').value as Arg;
      } else {
        return returnAsyncFixme(subject, 'request', args);
      }
      const properties: t.ObjectProperty[] = [];
      const fetchMethod = httpMethodsWithShortcut.has(method) ? method.toLowerCase() : 'fetch';
      if (!httpMethodsWithShortcut.has(method))
        properties.push(t.objectProperty(t.identifier('method'), t.stringLiteral(method)));
      const responseExpression =
        subject
            .member('request', SubjectType.Request)
            .callAsync(fetchMethod, properties.length ? [url, t.objectExpression(properties)] : [url]);
      return wrap(createSubject(SubjectType.Response, responseExpression, 3));
    }

    rightclick(subject: Subject, args: t.Expression[]): ReturnValue {
      return this._click('rightclick', subject, args);
    }

    root(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      subject = this._locatorSubject(pageSubject, context);
      if (subject === pageSubject)
        return wrap(subject.chain('locator', [t.stringLiteral(':root')], SubjectType.Locator));
      return wrap(subject);
    }

    scrollIntoView(subject: Subject, args: t.Expression[]): ReturnValue {
      return wrap(subject, subject.callAsync('scrollIntoViewIfNeeded'));
    }

    scrollTo(subject: Subject, args: t.Expression[]): ReturnValue {
      if (subject.type === SubjectType.Locator)
        return wrap(subject, subject.callAsync('scrollIntoViewIfNeeded'));
      return returnAsyncFixme(subject, 'scrollTo', args);
    }

    select(subject: Subject, args: t.Expression[]): ReturnValue {
      const wrapLabel = (arg: t.Expression) => {
        return t.objectExpression(
            [t.objectProperty(t.identifier('label'), arg)]
        );
      };
      if (t.isStringLiteral(args[0]))
        return wrap(subject, subject.callAsync('selectOption', [wrapLabel(args[0])]));
      if (t.isArrayExpression(args[0]))
        return wrap(subject, subject.callAsync('selectOption', [t.arrayExpression((args[0].elements as any).map(wrapLabel))]));
      return returnAsyncFixme(subject, 'select', args);
    }

    should(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (t.isFunctionExpression(args[0]) || t.isArrowFunctionExpression(args[0]))
        return this._then('should', subject, args, context);

      if (!t.isStringLiteral(args[0]))
        return returnAsyncFixme(subject, 'should', args);

      const matcher = args[0].value;
      const isNot = matcher.startsWith('not.');
      const absMatcher = isNot ? matcher.substring(4) : matcher;

      // 'have.html'
      if (subject.type === SubjectType.Locator && absMatcher === 'have.html') {
        const expectObject = expectPollCall(
            subject.callSync('evaluate', [
              t.arrowFunctionExpression(
                  [t.identifier('element')],
                  t.memberExpression(t.identifier('element'), t.identifier('outerHTML'))
              )
            ]),
            isNot
        );
        return wrap(subject, expectObject.callAsync('toContain', args.slice(1)));
      }

      // 'match' - match CSS jquery
      if (subject.type === SubjectType.Locator && absMatcher === 'match') {
        const expectObject = expectPollCall(
            subject.callSync('evaluateAll', [
              t.arrowFunctionExpression(
                  [t.identifier('elements'), t.identifier('match')],
                  t.blockStatement([
                    t.variableDeclaration(
                        'const', [
                          t.variableDeclarator(
                              t.identifier('matches'),
                              t.newExpression(t.identifier('Set'), [
                                utils.makeSyncCall(t.identifier('document'), 'querySelectorAll', [t.identifier('match')])
                              ])
                          ),
                        ]
                    ),
                    t.returnStatement(
                        t.unaryExpression('!',
                            t.unaryExpression('!',
                                utils.makeSyncCall(t.identifier('elements'), 'find', [
                                  t.arrowFunctionExpression(
                                      [t.identifier('e')],
                                      utils.makeSyncCall(t.identifier('matches'), 'has', [t.identifier('e')]
                                      )
                                  )
                                ])
                            )
                        )
                    )
                  ])
              ),
              args[1]
            ]),
            isNot
        );
        return wrap(subject, expectObject.callAsync('toBeTruthy'));
      }

      // Locator matchers.
      if (subject.type === SubjectType.Locator) {
        for (const [fromMatcher, toMatcher] of locatorMatchers) {
          if (absMatcher !== fromMatcher)
            continue;
          const expectExpression = subject.expectAsync(toMatcher.target, toMatcher.transform?.(args.slice(1), utils) || args.slice(1), isNot);
          return wrap(subject, expectExpression);
        }
      }

      // Page matchers.
      if (subject.type === SubjectType.Page) {
        for (const [fromMatcher, toMatcher] of pageMatchers) {
          if (absMatcher !== fromMatcher)
            continue;
          const expectExpression = subject.expectAsync(toMatcher.target, toMatcher.transform?.(args.slice(1), utils) || args.slice(1), isNot);
          return wrap(subject, expectExpression);
        }
      }

      // Other matchers.
      for (const [fromMatcher, toMatcher] of valueMatchers) {
        if (absMatcher !== fromMatcher)
          continue;
        return wrap(subject, expectPollCall(subject.expression, isNot).callAsync(toMatcher.target, args.slice(1)));
      }

      return returnAsyncFixme(subject, 'should', args);
    }

    siblings(subject: Subject, args: t.Expression[]): ReturnValue {
      return returnSyncFixme(subject, 'siblings', args, true);
    }

    submit(subject: Subject, args: t.Expression[]): ReturnValue {
      const formParam = t.identifier('form');
      return wrap(subject, subject.callAsync('evaluate', [
        t.arrowFunctionExpression(
            [
              formParam,
            ],
            t.callExpression(
                t.memberExpression(t.identifier('form'), t.identifier('submit')),
                []
            )
        )
      ]));
    }

    text(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject.chainAsync('textContent', [], SubjectType.String));
    }

    then(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return this._then('then', subject, args, context);
    }

    _then(name: 'then' | 'should', subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (!t.isArrowFunctionExpression(args[0]) && !t.isFunctionExpression(args[0]))
        return returnAsyncFixme(subject, name, args);

      const body = (args[0] as t.ArrowFunctionExpression).body;
      const statements = t.isBlockStatement(body) ? body.body : [t.expressionStatement(body)];
      args[0].async = true;
      if (!args[0].params.length)
        return wrap(subject, statements);

      if (!t.isIdentifier(args[0].params[0]))
        return returnAsyncFixme(subject, name, args);

      const { scope, newState, createBlockScope } = createScopeVariable(subject.type, args[0].params[0].name, context);
      const argPath = context.path.get('arguments.0') as NodePath;
      argPath.traverse(context.visitor({
        ...newState,
        scope
      }));

      const variable = t.variableDeclaration(
          'const',
          [t.variableDeclarator(scope.expression as t.Identifier, subject.expression)]
      );
      if (subject.type === SubjectType.Window) {
        return wrap(
            subject,
            [
              variable,
              scope.callAsync(
                  'evaluate',
                  [
                    t.arrowFunctionExpression(
                        [args[0].params[0]],
                        t.blockStatement(statements)
                    )
                  ]
              ),
            ]
        );
      }
      const allStatements = [variable, ...statements];
      if (name === 'then') {
        return wrap(
            subject,
            createBlockScope ? t.blockStatement(allStatements) : allStatements,
        );
      }
      return wrap(
          subject,
          expectToPass(t.blockStatement(allStatements), false),
      );
    }

    trigger(subject: Subject, args: t.Expression[]): ReturnValue {
      // It is unsafe to chain to trigger, hence re-root.
      return wrap(
          pageSubject,
          subject.callAsync('dispatchEvent', args));
    }

    type(subject: Subject, args: t.Expression[]): ReturnValue {
      const [arg1] = args;

      const tokens: { key?: string, text?: string, node?: t.Expression }[] = [];
      const addText = (text: string) => {
        if (!text)
          return;
        const keys: string[] = [];
        const chunks = text.replace(/{([^}]+)}/g, (_, key) => {
          keys.push(key);
          return '\u001E';
        }).split('\u001E');
        if (chunks[0])
          tokens.push({ text: chunks[0] });
        for (let i = 1; i < chunks.length; ++i) {
          tokens.push({ key: keys[i - 1] });
          if (chunks[i])
            tokens.push({ text: chunks[i] });
        }
      };

      if (t.isStringLiteral(arg1)) {
        addText((arg1 as t.StringLiteral).value);
      } else if (t.isTemplateLiteral(arg1)) {
        addText(arg1.quasis[0].value.raw);
        for (let i = 1; i < arg1.quasis.length; ++i) {
          tokens.push({ node: arg1.expressions[i - 1] as t.Expression });
          addText(arg1.quasis[1].value.raw);
        }
      }

      const options = utils.callOptions(args, ['force', 'timeout', 'delay']);
      const optionsWithoutDelay = utils.callOptions(args, ['force', 'timeout']);
      const effectiveMethod = utils.hasCallOption(args, 'delay') ? 'type' : 'fill';

      if (!tokens.find(t => !!t.key))
        return wrap(subject, subject.callAsync(effectiveMethod, [args[0], ...options]));

      const pageKeyboard = pageSubject.member('keyboard', SubjectType.Keyboard);
      const modifiers: string[] = [];
      const result: t.Expression[] = [];
      for (const token of tokens) {
        if (token.node) {
          result.push(subject.callAsync(effectiveMethod, [token.node, ...options]));
          continue;
        }
        if (token.key) {
          const modifier = modifierMap.get(token.key.toLowerCase());
          if (modifier) {
            modifiers.push(modifier);
            result.push(pageKeyboard.callAsync('down', [t.stringLiteral(modifier), ...optionsWithoutDelay]));
            continue;
          }
          const value = keyMap.get(token.key.toLowerCase());
          if (!value)
            throw new Error('Unknown key: ' + token.key);
          result.push(subject.callAsync('press', [typeof value === 'string' ? t.stringLiteral(value) : value, ...optionsWithoutDelay]));
          continue;
        }
        result.push(subject.callAsync(effectiveMethod, [t.stringLiteral(token.text!), ...options]));
      }
      for (const modifier of modifiers.reverse())
        result.push(pageKeyboard.callAsync('up', [t.stringLiteral(modifier), ...optionsWithoutDelay]));
      return wrap(subject, result);
    }

    uncheck(subject: Subject, args: t.Expression[]) {
      return this._check('uncheck', subject, args);
    }

    viewport(subject: Subject, args: t.Expression[]): ReturnValue {
      const returnSubject = voidSubject;
      if (args.length === 2 && !t.isStringLiteral(args[0])) {
        return wrap(
            voidSubject,
            subject.callAsync('setViewportSize', [
              t.objectExpression([
                t.objectProperty(t.identifier('width'), args[0]),
                t.objectProperty(t.identifier('height'), args[1]),
              ])
            ])
        );
      }

      if (args.length > 0 && t.isStringLiteral(args[0])) {
        const viewport = deviceViewports[args[0].value];
        if (!viewport)
          return returnAsyncFixme(subject, 'viewport', args);

        const landscape = args.length > 1 && t.isStringLiteral(args[1]) && args[1].value === 'landscape';
        const result = subject.callAsync('setViewportSize', [
          t.objectExpression([
            t.objectProperty(t.identifier('width'), t.numericLiteral(landscape ? viewport.height : viewport.width)),
            t.objectProperty(t.identifier('height'), t.numericLiteral(landscape ? viewport.width : viewport.height)),
          ])
        ]);
        t.addComment(result, 'leading', ' ' + args[0].value + (landscape ? ', landscape' : ''), true);
        return wrap(returnSubject, result);
      }
      return returnAsyncFixme(subject, 'viewport', args);
    }

    visit(subject: Subject, args: t.Expression[]): ReturnValue {
      let onBeforeLoad: t.ObjectMethod | undefined;
      let onLoad: t.ObjectMethod | undefined;
      let timeout: t.ObjectProperty | undefined;

      const gotoOptions = args[args.length - 1];
      if (t.isObjectExpression(gotoOptions)) {
        onBeforeLoad = utils.getMethod(gotoOptions, 'onBeforeLoad');
        onLoad = utils.getMethod(gotoOptions, 'onLoad');
        timeout = utils.getProperty(gotoOptions, 'timeout');
      }
      const steps: t.Expression[] = [];
      const properties: t.ObjectProperty[] = [];
      if (timeout)
        properties.push(timeout);

      if (onBeforeLoad) {
        steps.push(pageSubject.callAsync('addInitScript', [
          t.arrowFunctionExpression([], t.blockStatement([
            t.variableDeclaration('const', [
              t.variableDeclarator((onBeforeLoad.params[0] as t.Identifier), t.identifier('window'))
            ]),
            ...onBeforeLoad.body.body
          ]), true)
        ]));
      }

      steps.push(subject.callAsync('goto', properties.length ? [args[0], t.objectExpression(properties)] : [args[0]]));

      if (onLoad) {
        steps.push(pageSubject.callAsync('evaluate', [
          t.arrowFunctionExpression([], t.blockStatement([
            t.variableDeclaration('const', [
              t.variableDeclarator((onLoad.params[0] as t.Identifier), t.identifier('window'))
            ]),
            ...onLoad.body.body
          ]), true)
        ]));
      }

      return wrap(
          createSubject(SubjectType.Window, t.identifier('window')),
          steps
      );
    }

    wait(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const [arg1, arg2] = args;
      if (arg1 && t.isNumericLiteral(arg1) && !arg2)
        return wrap(subject, subject.callAsync('waitForTimeout', args));
      if (arg1 && t.isStringLiteral(arg1) && arg1.value.startsWith('@')) {
        const alias = arg1.value.substring(1);
        const aliasType = context.aliasTypes.get(alias);
        if (!aliasType)
          return returnAsyncFixme(subject, 'wait', args);
        return wrap(createSubject(aliasType, t.awaitExpression(t.identifier(alias))));
      }
      return returnAsyncFixme(subject, 'wait', args);
    }

    window(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject.chainAsync('evaluateHandle', [t.stringLiteral('window')], SubjectType.Window));
    }

    within(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (!t.isFunctionExpression(args[0]) && !t.isArrowFunctionExpression(args[0]))
        return returnAsyncFixme(subject, 'within', args);

      const param = args[0].params[0];
      const scopeName = t.isIdentifier(param) ? param.name : 'scope';
      const { scope, newState, createBlockScope } = createScopeVariable(subject.type, scopeName, context);
      (context.path.get('arguments.0') as NodePath).traverse(context.visitor({
        ...newState,
        scope
      }));

      const body = args[0].body;
      const allStatements = [
        t.variableDeclaration(
            'const',
            [t.variableDeclarator(scope.expression as t.Identifier, subject.expression)]
        ),
        ...(t.isBlockStatement(body) ? body.body : [t.expressionStatement(body)])
      ];
      return wrap(
          subject,
          createBlockScope ? t.blockStatement(allStatements) : allStatements
      );
    }

    _locatorSubject(subject: Subject, context: Context): Subject {
      if (context.state.scope?.type === SubjectType.Locator)
        return context.state.scope;
      return subject;
    }

    _locator(subject: Subject, selector: t.Expression, context: Context): Subject {
      subject = this._locatorSubject(subject, context);

      const locator = subject.chain('locator', [selector], SubjectType.Locator);
      if (t.isStringLiteral(selector) && selector.value.endsWith(':first')) {
        selector.value = selector.value.substring(0, selector.value.length - 6);
        return locator.chain('first', [], SubjectType.Locator);
      }
      if (t.isStringLiteral(selector) && selector.value.endsWith(':last')) {
        selector.value = selector.value.substring(0, selector.value.length - 5);
        return locator.chain('last', [], SubjectType.Locator);
      }
      return locator;
    }

    _click(kind: 'click' | 'dblclick' | 'rightclick', subject: Subject, args: t.Expression[]): ReturnValue {
      // .click()
      // .click(options)
      // .click(position)
      // .click(position, options)
      // .click(x, y)
      // .click(x, y, options)

      const properties: t.ObjectProperty[] = [];

      if (kind === 'rightclick')
        properties.push(t.objectProperty(t.identifier('button'), t.stringLiteral('right')));

      const [arg1, arg2] = args;
      if (args.length >= 2 && t.isNumericLiteral(arg1) && t.isNumericLiteral(arg2)) {
        // .click(position)
        // .click(position, options)
        properties.push(
            t.objectProperty(
                t.identifier('position'),
                t.objectExpression([
                  t.objectProperty(t.identifier('x'), arg1),
                  t.objectProperty(t.identifier('y'), arg2),
                ])
            ),
        );
      }

      const position = t.isStringLiteral(arg1) && arg1.value !== 'center' ? arg1.value : undefined;
      const lastArg = args[args.length - 1];
      let multiple = false;

      const clickOptions = t.isObjectExpression(lastArg) ? lastArg : undefined;
      if (clickOptions) {
        // .click(options)
        // .click(position, options)
        // .click(x, y, options)
        const modifiers: t.StringLiteral[] = [];
        if (utils.getBooleanProperty(clickOptions, 'altKey'))
          modifiers.push(t.stringLiteral('Alt'));
        if (utils.getBooleanProperty(clickOptions, 'ctrlKey'))
          modifiers.push(t.stringLiteral('Control'));
        if (utils.getBooleanProperty(clickOptions, 'metaKey'))
          modifiers.push(t.stringLiteral('Meta'));
        if (utils.getBooleanProperty(clickOptions, 'shiftKey'))
          modifiers.push(t.stringLiteral('Shift'));

        if (modifiers.length) {
          properties.push(t.objectProperty(
              t.identifier('modifiers'),
              t.arrayExpression(modifiers)));
        }

        properties.push(...utils.callOptionProperties(args, ['force', 'timeout']));
        multiple = utils.getBooleanProperty(clickOptions, 'multiple');
      }

      if (multiple) {
        const clickExpression = createSubject(SubjectType.Locator, t.identifier('locator'))
            .callAsync(kind === 'dblclick' ? 'dblclick' : 'click', properties.length ? [t.objectExpression(properties)] : []);
        const forLoop = t.forOfStatement(
            t.variableDeclaration('const', [t.variableDeclarator(t.identifier('locator'))]),
            subject.callAsync('all'),
            t.expressionStatement(clickExpression)
        );

        return wrap(subject, forLoop);
      }

      if (position)
        properties.push(this._positionProperty(subject, position as any));

      const clickExpression = subject.callAsync(kind === 'dblclick' ? 'dblclick' : 'click', properties.length ? [t.objectExpression(properties)] : []);
      if (position) {
        return wrap(subject, t.blockStatement([
          this._boundingBoxVariableDeclaration(subject.expression),
          t.expressionStatement(clickExpression)
        ]));
      }
      return wrap(subject, clickExpression);
    }

    _check(kind: 'check' | 'uncheck', subject: Subject, args: t.Expression[]): ReturnValue {
      const options = utils.callOptions(args, ['force', 'timeout']);
      const checkCall = (value: t.StringLiteral) => {
        const additionalSelector = `input[value="${value.value}"]:scope`;
        const locatorWithValue = subject.chain('locator', [t.stringLiteral(additionalSelector)], SubjectType.Locator);
        return locatorWithValue.callAsync(kind, [...options]);
      };

      if (t.isStringLiteral(args[0]))
        return wrap(subject, checkCall(args[0]));

      if (t.isArrayExpression(args[0]))
        return wrap(subject, args[0].elements.map(s => checkCall(s as t.StringLiteral)));

      return wrap(subject, subject.callAsync(kind, [...options]));
    }

    _boundingBoxVariableDeclaration(subject: t.Expression) {
      return t.variableDeclaration(
          'const',
          [
            t.variableDeclarator(
                t.identifier('box'),
                t.logicalExpression('||',
                    t.awaitExpression(
                        t.callExpression(
                            t.memberExpression(subject, t.identifier('boundingBox')),
                            []
                        )
                    ),
                    t.objectExpression([
                      t.objectProperty(t.identifier('width'), t.numericLiteral(0)),
                      t.objectProperty(t.identifier('height'), t.numericLiteral(0)),
                    ])
                )
            )
          ]
      );
    }

    _positionProperty(subject: Subject, position: 'topLeft' | 'top' | 'topRight' | 'left' | 'right' | 'bottomLeft' | 'bottom' | 'bottomRight') {
      let x: t.Expression;
      let y: t.Expression;

      const minX = t.numericLiteral(5);
      const minY = t.numericLiteral(5);

      const midX = t.binaryExpression(
          '/',
          t.memberExpression(t.identifier('box'), t.identifier('width')),
          t.numericLiteral(2));
      const midY = t.binaryExpression(
          '/',
          t.memberExpression(t.identifier('box'), t.identifier('height')),
          t.numericLiteral(2));

      const maxX = t.binaryExpression(
          '-',
          t.memberExpression(t.identifier('box'), t.identifier('width')),
          t.numericLiteral(5));
      const maxY = t.binaryExpression(
          '-',
          t.memberExpression(t.identifier('box'), t.identifier('height')),
          t.numericLiteral(5));

      switch (position) {
        case 'top': x = minX; y = midY; break;
        case 'right': x = maxX; y = midY; break;
        case 'bottom': x = midX; y = maxY; break;
        case 'left': x = minX; y = midY; break;
        case 'topLeft': x = minX; y = minY; break;
        case 'topRight': x = maxX; y = minY; break;
        case 'bottomLeft': x = minX; y = maxY; break;
        case 'bottomRight': x = maxX; y = maxY; break;
      }

      const objectValue = t.objectExpression([
        t.objectProperty(t.identifier('x'), x),
        t.objectProperty(t.identifier('y'), y),
      ]);
      t.addComment(objectValue, 'inner', ' ' + position);
      return t.objectProperty(
          t.identifier('position'),
          objectValue);
    }
  }

  return { CyMapping, pageSubject };
};
