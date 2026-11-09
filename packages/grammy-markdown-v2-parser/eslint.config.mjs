// @ts-check

import config from "@grammy-testing-library/config/eslint";
import { defineConfig } from "eslint/config";

export default defineConfig({
  extends: [config],
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
