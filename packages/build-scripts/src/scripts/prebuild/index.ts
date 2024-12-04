#!/usr/bin/env tsx

import { Thoth_Server } from "@iliad.dev/thoth";
const thoth = new Thoth_Server({
  config: {
    prefix: {
      newLine: false,
      timestamp: {
        components: ["time"],
        enabled: true,
      },
      module: {
        enabled: false,
      },
    },
  },
});

const testLog = thoth.$log("Hello, world!");
const error = testLog
  ._warn("Test warning!")
  ._error("Test error!")
  .info("sibling1")
  .info("sibling2");

const rootTest = thoth.log("Testing");
rootTest._info("Testing A");
rootTest._info("Testing B");

const nestedError = error.$log("Nested power logger");
nestedError._info("Nested info!");
setTimeout(() => {
  testLog.succeed("Test success!")._info("double success");
  setTimeout(() => {
    nestedError.succeed("Test success!")._info("final success");
  }, 4000);
}, 1000);

// const topLevelLog = thoth.$log("Top level module");

// const subLog1 = topLevelLog._log("which-module@2.0.1 extraneous");
// const subLog2 = topLevelLog._log("workerpool@6.5.1 extraneous");
// const subLog3 = topLevelLog._log("UNMET DEPENDENCY @changesets/cli@^2.27.9");

// const nestedLog = topLevelLog._log(
//   "@iliad.dev/build-scripts@0.1.0 -> ./packages/build-scripts"
// );

// const nestedSubLog = nestedLog._log(
//   "@iliad.dev/strapi-adapter@0.1.5 deduped -> ./packages/strapi-adapter"
// );

// const subLog4 = topLevelLog._log("yargs-unparser@2.0.0 extraneous");
