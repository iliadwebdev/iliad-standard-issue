#!/usr/bin/env tsx
var __getOwnPropNames = Object.getOwnPropertyNames;
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// src/scripts/prebuild/index.ts
var prebuild_exports = {};
import { Thoth_Server } from "@iliad.dev/thoth";
var thoth, testLog, error, rootTest, nestedError;
var init_prebuild = __esm({
  "src/scripts/prebuild/index.ts"() {
    "use strict";
    thoth = new Thoth_Server({
      config: {
        prefix: {
          newLine: false,
          timestamp: {
            components: ["time"],
            enabled: true
          },
          module: {
            enabled: false
          }
        }
      }
    });
    testLog = thoth.$log("Hello, world!");
    error = testLog._warn("Test warning!")._error("Test error!").info("sibling1").info("sibling2");
    rootTest = thoth.log("Testing");
    rootTest._info("Testing A");
    rootTest._info("Testing B");
    nestedError = error.$log("Nested power logger");
    nestedError._info("Nested info!");
    setTimeout(() => {
      testLog.succeed("Test success!")._info("double success");
      setTimeout(() => {
        nestedError.succeed("Test success!")._info("final success");
      }, 4e3);
    }, 1e3);
  }
});

// import("./scripts/**/*/index.ts") in src/cli.ts
var globImport_scripts_index_ts = __glob({
  "./scripts/prebuild/index.ts": () => Promise.resolve().then(() => (init_prebuild(), prebuild_exports))
});

// src/cli.ts
var [, , command, ...args] = process.argv;
var script = (name) => globImport_scripts_index_ts(`./scripts/${name}/index.ts`);
switch (command) {
  case "prebuild":
    script("prebuild");
    break;
  default:
    console.error(`Unknown command: ${command}`);
}
