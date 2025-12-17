import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.config({
    extends: ['@pdap-design-system/eslint-config'],
    plugins: ['prettier'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['.vue'],
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    settings: {
      'import/core-modules': ['vue-router/auto-routes']
    },
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/script-setup-uses-vars': 'error',
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none',
          htmlWhitespaceSensitivity: 'ignore',
          bracketSameLine: false,
          singleAttributePerLine: false,
          singleQuote: true
        }
      ]
    }
  }),
  {
    files: [
      '**/__tests__/**/*.{js,ts,vue}',
      '**/*.{spec,test}.{js,ts,vue}'
    ],
    languageOptions: {
      globals: {
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        test: 'readonly',
        vi: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      'playwright-report',
      'test-results',
      '*.config.*'
    ]
  }
];
