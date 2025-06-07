// tsup.config.ts
import { defineConfig } from "tsup";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  entry: ["src/index.ts"],
  outDir: "./dist",
  ignoreWatch: ["admin"],
  format: ["cjs", "esm"],
  sourcemap: true,
  splitting: true,
  clean: true,
  dts: true,
  skipNodeModulesBundle: true,
  esbuildPlugins: [
    TsconfigPathsPlugin({
      tsconfig: "./server/tsconfig.json",
    }),
  ],
});
