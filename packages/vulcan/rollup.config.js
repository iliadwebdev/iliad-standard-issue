const nodeResolve = require("@rollup/plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
const dts = require("rollup-plugin-dts").default;
const pkg = require("./package.json");

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
    plugins: [typescript()],
    external: ["@iliad.dev/hermes", "typescript", "@strapi/strapi", "qs"], // <-- suppresses the warning
  },
  {
    input: `src/index.d.ts`,
    plugins: [dts(), nodeResolve()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
];
