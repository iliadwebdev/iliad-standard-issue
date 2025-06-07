// import type { Options } from "tsup";

// const env = process.env.NODE_ENV;

// export const tsup: Options = {
//   splitting: true,
//   sourcemap: env === "prod", // source map is only available in prod
//   clean: true, // rimraf disr
//   dts: true, // generate dts file for main module
//   format: ["cjs", "esm"], // generate cjs and esm files
//   minify: env === "production",
//   bundle: env === "production",
//   skipNodeModulesBundle: true,
//   entryPoints: ["src/index.ts"],
//   watch: env === "development",
//   target: "es2020",
//   outDir: env === "production" ? "dist" : "lib",
//   entry: ["src/**/*.ts"],
// };

// import generateGlobals from "./scripts/generate-globals";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2019",
  outDir: "dist",
  skipNodeModulesBundle: true,
  sourcemap: true,
  clean: true,
  dts: true,
});

// On Success hook doesn't wait for dts generation
process.on("beforeExit", async (code) => {
  if (code !== 0) return;
  // await generateGlobals();
});
