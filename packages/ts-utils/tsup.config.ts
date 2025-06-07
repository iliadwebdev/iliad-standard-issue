import generateGlobals from "./scripts/generate-globals";
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
  await generateGlobals();
});
