import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.browser,
    },
    extends: [js.configs.recommended],
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'script' },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
  },
  {
    files: ['**/*.json'],
    extends: [json.configs.recommended],
  },
  {
    files: ['**/*.jsonc'],
    extends: [json.configs['recommended-with-jsonc']],
  },
  {
    files: ['**/*.json5'],
    extends: [json.configs['recommended-with-json5']],
  },
  {
    files: ['**/*.md'],
    extends: [markdown.configs.recommended],
  },
  {
    files: ['**/*.css'],
    extends: [css.configs.recommended],
  },
]);
