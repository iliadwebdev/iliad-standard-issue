const nodeResolve = require("@rollup/plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const dts = require("rollup-plugin-dts").default;
const pkg = require("./package.json");
const fs = require("fs");

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

fs.copyFileSync("src/prim-ext.json", "dist/tsconfig.json");
fs.copyFileSync("src/global.d.ts", "dist/global.d.ts");

module.exports = [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
        strict: false,
      },
    ],
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      nodeResolve({
        // preferBuiltins: true,
        // browser: true,
      }),
    ],
    external: ["@iliad.dev/hermes", "typescript", "@strapi/strapi", "qs"], // <-- suppresses the warning
  },
];
