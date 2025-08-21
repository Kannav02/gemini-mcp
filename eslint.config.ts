import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base configuration for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
    },
  },

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Essential rules only
  {
    rules: {
      // === TypeScript Rules ===

      // Prevent using 'any' type - this defeats TypeScript's purpose
      '@typescript-eslint/no-explicit-any': 'warn',

      // Catch unused variables and parameters
      '@typescript-eslint/no-unused-vars': 'error',

      // === Basic Code Quality ===

      // Prevent console.log in production code
      'no-console': 'warn',

      // Use const when variables aren't reassigned
      'prefer-const': 'error',

      // Don't use var - use let/const instead
      'no-var': 'error',

      // Always use semicolons
      semi: 'error',

      // === Error Prevention ===

      // Prevent accidental assignments in conditions
      'no-cond-assign': 'error',

      // Prevent unreachable code
      'no-unreachable': 'error',
    },
  },

  // Ignore build files
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]);
