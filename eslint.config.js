import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierConfig from 'eslint-config-prettier';

export default [
  // JavaScript recommended rules
  js.configs.recommended,

  // TypeScript files configuration
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        HTMLElement: 'readonly',
        HTMLSpanElement: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // TypeScript specific rules
      ...tsPlugin.configs.recommended.rules,

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Custom TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-shadow': 'error',

      // General code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'off',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-with': 'error',
      'prefer-promise-reject-errors': 'error',
      radix: 'error',
      'require-await': 'off',
      'no-empty': 'error',
      'no-lonely-if': 'error',
      'no-bitwise': 'off',
      'no-cond-assign': 'off',
      'no-constant-condition': 'warn',
      'no-control-regex': 'off',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-obj-calls': 'error',
      'no-prototype-builtins': 'off',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      curly: 'error',
      'dot-notation': 'error',
      'no-caller': 'error',
      'no-else-return': 'error',
      'no-eq-null': 'off', // Allow == null checks
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-fallthrough': 'off',
      'no-floating-decimal': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'off',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': 'off',
      'no-multi-spaces': 'error',
      'no-native-reassign': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-symbol': 'error',
      'no-octal': 'error',
      'no-redeclare': 'off',
      'no-restricted-properties': 'off',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-undef-init': 'error',
      'no-unused-expressions': 'off',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-warning-comments': 'warn',
      'prefer-arrow-callback': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'symbol-description': 'error',
      yoda: 'error',
    },
  },

  // Configuration for test files
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLSpanElement: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
    },
  },

  // Configuration for config files
  {
    files: ['*.config.ts', '*.config.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.d.ts',
      '*.d.mts',
      'tsdown.config.ts',
      'eslint.config.js',
    ],
  },

  // Prettier config (must be last)
  prettierConfig,
];
