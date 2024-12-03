import type { Options } from "tsup";
const env = process.env.NODE_ENV;

// @ts-ignore
// import babel from "esbuild-plugin-babel";

export const tsup: Options = {
  splitting: true,
  sourcemap: env === "prod", // source map is only available in prod
  clean: true, // rimraf disr
  dts: true, // generate dts file for main module
  format: ["cjs", "esm"], // generate cjs and esm files
  minify: env === "production",
  // shims: true,
  // esbuildPlugins: [babel()], // This is not working
  bundle: true,
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.ts"],
  watch: env === "development",
  target: "es2020",
  outDir: env === "production" ? "dist" : "lib",
  entry: ["src/**/*.ts"],
  tsconfig: "tsconfig.json",
  // external: ["react-devtools-core", "yoga-wasm-web"],
};
