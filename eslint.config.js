const js = require("@eslint/js");
const globals = require("globals");
const pluginReact = require("eslint-plugin-react");
const { defineConfig } = require("eslint/config");
const jest = require('eslint-plugin-jest');


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
    files: ['test/**'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
    },
  },
  pluginReact.configs.flat.recommended,
]);
