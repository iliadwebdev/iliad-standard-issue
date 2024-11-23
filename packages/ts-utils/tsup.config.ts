import type { Options } from "tsup";
import cpx from "cpx";
import { $ } from "zx";

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  sourcemap: env === "prod", // source map is only available in prod
  clean: true, // rimraf disr
  dts: true, // generate dts file for main module
  format: ["cjs", "esm"], // generate cjs and esm files
  minify: env === "production",
  bundle: env === "production",
  skipNodeModulesBundle: true,
  entryPoints: ["src/index.ts"],
  watch: env === "development",
  target: "es2020",
  outDir: env === "production" ? "dist" : "lib",
  entry: ["src/**/*.ts"],
  onSuccess: async () => {
    // await $`tsx scripts/generate-globals.ts`;
    // console.log(`Generated globals.d.ts`);

    // await $`tsx scripts/merge-globals.ts`;
    // console.log(`Merged globals.d.ts`);

    console.log(`Copying @types directory to root`);
    try {
      cpx.copy("./src/@types/**/*", "./@types");
      console.log(`Copied @types directory to root`);
    } catch (e) {
      console.error(`Error copying @types directory to root:`, e);
    }
  },
};
