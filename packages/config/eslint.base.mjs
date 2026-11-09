// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig({
  plugins: {
    "@typescript-eslint": tseslint.plugin,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  extends: [eslint.configs.recommended, tseslint.configs.recommended],
  rules: {
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/switch-exhaustiveness-check": "error",
  },
});
