// QUnit-compatibility adapter for Vitest. The legacy 459-test suite
// uses `QUnit.module(name, hooks)`, `QUnit.test(name, fn)` with
// `assert.*` methods, and the `QUnit.testStart`/`QUnit.testDone`
// global hooks that `test/setup/environment.js` relies on to stub
// `Backbone.ajax` per-test.
//
// This shim translates all of those into the equivalent Vitest
// primitives (`describe`/`test`/`beforeEach`/`afterEach`/`expect`)
// without requiring any rewrites in the 8 test files.

import {test, expect, beforeAll, beforeEach, afterEach, afterAll} from 'vitest';

let currentModule = null;
const globalBefore = [];
const globalAfter = [];

function makeAssert(asyncDones) {
  return {
    ok(value, msg) { expect(Boolean(value), msg).toBe(true); },
    notOk(value, msg) { expect(Boolean(value), msg).toBe(false); },
    // QUnit's `equal` is loose (==); use a custom non-strict comparison.
    equal(actual, expected, msg) {
      // eslint-disable-next-line eqeqeq
      expect(actual == expected, msg || `${actual} == ${expected}`).toBe(true);
    },
    notEqual(actual, expected, msg) {
      // eslint-disable-next-line eqeqeq
      expect(actual != expected, msg || `${actual} != ${expected}`).toBe(true);
    },
    strictEqual(actual, expected, msg) { expect(actual, msg).toBe(expected); },
    notStrictEqual(actual, expected, msg) { expect(actual, msg).not.toBe(expected); },
    deepEqual(actual, expected, msg) { expect(actual, msg).toEqual(expected); },
    notDeepEqual(actual, expected, msg) { expect(actual, msg).not.toEqual(expected); },
    'throws'(blk, expected, msg) {
      if (typeof expected === 'string') { msg = expected; expected = undefined; }
      expect(blk, msg).toThrow(expected);
    },
    raises(blk, expected, msg) { this['throws'](blk, expected, msg); },
    expect(_n) { /* QUnit assertion count; Vitest doesn't enforce. */ },
    async() {
      let done;
      const promise = new Promise((resolve) => { done = resolve; });
      asyncDones.push(promise);
      return () => done();
    },
    step(_label) { /* QUnit `step()` is a test-log message; no-op here. */ },
    verifySteps(_steps, _msg) { /* paired with `step()`; no-op. */ }
  };
}

const Q = {
  module(name, hooks) {
    currentModule = {name, hooks: hooks || {}};
  },

  test(testName, testFn) {
    const m = currentModule;
    const fullName = m ? `${m.name}: ${testName}` : testName;
    const hooks = m ? m.hooks : {};

    test(fullName, async () => {
      const env = {};
      Q.config.current = {testEnvironment: env};
      for (const fn of globalBefore) fn();
      if (hooks.beforeEach) await hooks.beforeEach.call(env, env);
      try {
        const asyncDones = [];
        const assert = makeAssert(asyncDones);
        await testFn.call(env, assert);
        if (asyncDones.length) await Promise.all(asyncDones);
      } finally {
        if (hooks.afterEach) await hooks.afterEach.call(env, env);
        for (const fn of globalAfter) fn();
      }
    });
  },

  testStart(fn) { globalBefore.push(fn); },
  testDone(fn) { globalAfter.push(fn); },

  config: {
    // Tests touch this; Karma's QUnit defaults `noglobals` to true at
    // the start of every test, which we already approximate by giving
    // each test a fresh `env` object.
    noglobals: false,
    current: {testEnvironment: {}}
  }
};

globalThis.QUnit = Q;

// Vitest top-level hooks are no-ops by default. We expose them in case a
// test file calls them directly. (None do today.)
export {beforeAll, beforeEach, afterEach, afterAll};
