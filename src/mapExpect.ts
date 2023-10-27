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
import type { Context, Subject } from './mapping';
import { createMapping, type ReturnValue, SubjectType } from './mapping';
import { capitalize, createUtils } from './utils';

export const createExpectMapping = (api: BabelAPI) => {
  const t = api.types;
  const utils = createUtils(api);
  const { createSubject, wrap } = createMapping(api);
  const voidSubject = createSubject(SubjectType.Void, t.identifier('void'));

  class ExpectMapping {
    constructor() {
    }

    fallback(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync(context.method, [t.identifier('page'), ...(args || [])]));
    }

    expect(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const scope = context.state.scope;
      const scopeExpression = scope?.expression;
      if (scope && t.isIdentifier(scopeExpression) && t.isIdentifier(args[0], { name: scopeExpression.name }))
        return wrap(scope);
      // For anonymous scope, assume locator.
      return wrap(createSubject(scope ? SubjectType.Locator : SubjectType.Value, args[0]));
    }

    contain(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (subject.type === SubjectType.Locator)
        return wrap(subject, subject.expectAsync('toHaveText', args));
      return wrap(subject, subject.expectSync('toContain', args));
    }

    eq(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (subject.type === SubjectType.Locator)
        return wrap(subject.chain('nth', args, SubjectType.Locator));
      return wrap(subject, subject.expectSync('toBe', args));
    }

    equal(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBe', args));
    }

    be_a(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (!t.isStringLiteral(args[0]))
        return wrap(subject, subject.expectSync('FIXME_toBeA', args));
      return wrap(subject, subject.expectSync('toEqual', [
        utils.makeSyncCall(
            t.identifier('expect'),
            'any',
            [t.identifier(capitalize(args[0].value))]
        )
      ]));
    }

    be_gt(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBeGreaterThan', args));
    }

    be_lt(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBeLessThan', args));
    }

    be_gte(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBeGreaterThanOrEqual', args));
    }

    be_lte(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBeLessThanOrEqual', args));
    }

    be_empty(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(voidSubject, subject.expectSync('toBeFalsy', args));
    }

    be_null(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(voidSubject, subject.expectSync('toBeNull', args));
    }

    be_oneOf(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const arraySubj = createSubject(SubjectType.Value, args[0]);
      return wrap(voidSubject, arraySubj.expectSync('toContain', [subject.expression]));
    }

    be_true(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toBeTruthy', args));
    }

    deep_eq(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toEqual', args));
    }

    deep_equal(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toEqual', args));
    }

    have_length(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (subject.type === SubjectType.Locator)
        return wrap(subject, subject.expectAsync('toHaveCount', args));
      return wrap(subject, subject.expectSync('toHaveLength', args));
    }

    have_property(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      if (!t.isStringLiteral(args[0]))
        return wrap(subject, subject.expectSync('FIXME_toHaveProperty', args));
      return wrap(subject.member(args[0].value, SubjectType.Value), subject.expectSync('toHaveProperty', args));
    }

    have_text(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectAsync('toHaveText', args));
    }

    include(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toContain', args));
    }

    include_keys(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('FIXME_toIncludeKeys', args));
    }

    match(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      return wrap(subject, subject.expectSync('toMatch', args));
    }

    property(subject: Subject, args: t.Expression[], context: Context): ReturnValue {
      const propertyName = context.propertyName || (t.isStringLiteral(args[0]) ? args[0].value : '');
      if (!propertyName)
        return wrap(subject, subject.expectSync('FIXME_property', args));
      if (subject.type === SubjectType.Response) {
        if (propertyName === 'body')
          return wrap(subject.chainAsync('json', [], SubjectType.Value));
        if (propertyName === 'status')
          return wrap(subject.chain('status', [], SubjectType.Value));
      }
      return wrap(subject.member(propertyName, SubjectType.Value));
    }
  }

  return { ExpectMapping };
};
