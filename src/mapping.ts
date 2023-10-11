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

import type { NodePath, types as t, Visitor } from '@babel/core';
import { type BabelAPI } from '@babel/helper-plugin-utils';
import { type Arg, createUtils } from './utils';

export enum SubjectType {
  Page = 'Page',
  Document = 'Document',
  Window = 'Window',
  URL = 'URL',
  Locator = 'Locator',
  String = 'String',
  Request = 'Request',
  Response = 'Response',
  Value = 'Value',
  Keyboard = 'Keyboard',
  Mouse = 'Mouse',
  Void = 'Void',
}


export type Subject = {
  type: SubjectType;
  expression: t.Expression;
  depth: number;
  chain(method: string, args: Arg[], returnType: SubjectType): Subject;
  chainAsync(method: string, args: Arg[], returnType: SubjectType): Subject;
  callSync(method: string, args?: Arg[]): t.CallExpression;
  callAsync(method: string, args?: Arg[]): t.AwaitExpression;
  member(member: string, type: SubjectType): Subject;
  expectSync(method: string, args?: Arg[], isNot?: boolean): t.Expression;
  expectAsync(method: string, args?: Arg[], isNot?: boolean): t.AwaitExpression;
};

export type ReturnValue = {
  subject: Subject;
  nodes: t.Node[];
};

export type State = {
  variables: Set<string>,
  scope?: Subject,
};

export type Context = {
  method: string;
  aliasTypes: Map<string, SubjectType>;
  isLast: boolean;
  path: NodePath<t.Node>;
  visitor: (state: State) => Visitor;
  state: State;
  propertyName?: string;
};

export const createMapping = (api: BabelAPI) => {
  const t = api.types;
  const utils = createUtils(api);

  class SubjectImpl implements Subject {
    constructor(
      public type: SubjectType,
      public expression: t.Expression,
      public depth: number = 0) {
    }

    chain(method: string, args: Arg[] = [], returnType: SubjectType): Subject {
      return new SubjectImpl(returnType, utils.makeSyncCall(this.expression, method, args), this.depth + 1);
    }

    chainAsync(method: string, args: Arg[] = [], returnType: SubjectType): Subject {
      return new SubjectImpl(returnType, utils.makeAsyncCall(this.expression, method, args), this.depth + 1);
    }

    callSync(method: string, args: Arg[] = []): t.CallExpression {
      return utils.makeSyncCall(this.expression, method, args);
    }

    callAsync(method: string, args: Arg[] = []): t.AwaitExpression {
      return utils.makeAsyncCall(this.expression, method, args);
    }

    member(member: string, type: SubjectType): Subject {
      let result = this.expression;
      for (const token of member.split('.'))
        result = t.memberExpression(this.expression, t.identifier(token), !isNaN(+token));
      return new SubjectImpl(type, result);
    }

    expectSync(method: string, args: Arg[] = [], isNot: boolean = false): t.Expression {
      const expectSubj = t.callExpression(
          t.identifier('expect'),
          [this.expression]
      );
      (expectSubj as any).__processed = true;
      return utils.makeSyncCall(
          isNot ? t.memberExpression(expectSubj, t.identifier('not'))
            : expectSubj, method, args);
    }

    expectAsync(method: string, args: Arg[] = [], isNot: boolean = false): t.AwaitExpression {
      return t.awaitExpression(this.expectSync(method, args, isNot));
    }
  }

  function wrap(subject: Subject, nodes: t.Node | t.Node[] = []): ReturnValue {
    if (!Array.isArray(nodes))
      nodes = [nodes];
    return { subject, nodes };
  }

  function returnSyncFixme(subject: Subject, name: string, args: Arg[], makeNewSubject: boolean = false): ReturnValue {
    if (makeNewSubject)
      return wrap(subject.chain(`FIXME_${name}`, args, SubjectType.Locator));
    return wrap(subject, subject.callSync(`FIXME_${name}`, args));
  }

  function returnAsyncFixme(subject: Subject, name: string, args: Arg[]): ReturnValue {
    return wrap(subject, subject.callAsync(`FIXME_${name}`, args));
  }

  function createSubject(type: SubjectType, expression: t.Expression, depth: number = 0): Subject {
    return new SubjectImpl(type, expression, depth);
  }

  function createScopeVariable(type: SubjectType, variableName: string, context: Context): { scope: Subject, newState: Context['state'], createBlockScope: boolean } {
    const createBlockScope = context.state.variables.has(variableName);
    context.state.variables.add(variableName);
    return {
      scope: createSubject(type, t.identifier(variableName)),
      newState: {
        ...context.state,
        variables: new Set(context.state.variables),
      },
      createBlockScope,
    };
  }

  return { createSubject, returnSyncFixme, returnAsyncFixme, wrap, createScopeVariable };
};
