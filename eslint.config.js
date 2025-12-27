const js = require("@eslint/js");
const globals = require("globals");
const pluginReact = require("eslint-plugin-react");
const { defineConfig } = require("eslint/config");
const jest = require('eslint-plugin-jest');
const { includeIgnoreFile } = require('@eslint/compat')
const path = require("node:path");

const gitignorePath = path.resolve(__dirname, ".gitignore");


module.exports = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    files: ['tests/**/*.js'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  {
    files: ["src/**/*.js"],
    rules: {
      //TODO V2: Replace with proper logging Library
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'consistent-return': 'error',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      'require-await': 'error',
      'no-floating-promises': 'off'
    }
  },
  includeIgnoreFile(gitignorePath),
  pluginReact.configs.flat.recommended,
]);
