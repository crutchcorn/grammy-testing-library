import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node22.12",
  outDir: "dist",
  dts: true,
  clean: true,
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});
