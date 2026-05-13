const js = require('@eslint/js');
const stylistic = require('@stylistic/eslint-plugin');
const globals = require('globals');

module.exports = [
  {
    files: ['backbone.js', 'modules/**/*.js', 'test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.amd
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'block-scoped-var': 'error',
      'camelcase': 'error',
      'dot-notation': ['error', {'allowKeywords': false}],
      'eqeqeq': ['error', 'smart'],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 5],
      'new-cap': ['error', {'newIsCapExceptions': ['model']}],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-div-regex': 'warn',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-else-return': 'warn',
      'no-empty-character-class': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-inner-declarations': 'error',
      'no-irregular-whitespace': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-multi-str': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-object-constructor': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-shadow': 'error',
      'no-throw-literal': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'warn',
      'no-unused-expressions': ['error', {'allowTernary': true, 'allowShortCircuit': true}],
      'no-with': 'error',
      'radix': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      '@stylistic/array-bracket-spacing': 'error',
      '@stylistic/brace-style': ['warn', '1tbs', {'allowSingleLine': true}],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/eol-last': 'error',
      '@stylistic/indent': ['error', 2, {'MemberExpression': 0, 'SwitchCase': 1, 'VariableDeclarator': 2}],
      '@stylistic/key-spacing': 'warn',
      '@stylistic/keyword-spacing': ['error', {'after': true}],
      '@stylistic/linebreak-style': 'error',
      '@stylistic/no-extra-parens': 'warn',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'never'],
      '@stylistic/quote-props': ['warn', 'consistent-as-needed', {'keywords': true}],
      '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
      '@stylistic/semi': 'error',
      '@stylistic/space-before-function-paren': ['error', {'anonymous': 'never', 'named': 'never'}],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', {'words': true, 'nonwords': false}],
      '@stylistic/wrap-iife': ['error', 'inside']
    }
  },

  // ES modules (modules/*.js) use `import` syntax
  {
    files: ['modules/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },

  // Test files run in the browser with QUnit and may throw literals freely
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        QUnit: 'readonly',
        Backbone: 'writable',
        _: 'writable',
        $: 'writable'
      }
    },
    rules: {
      'no-throw-literal': 'off',
      'no-undefined': 'off'
    }
  }
];
