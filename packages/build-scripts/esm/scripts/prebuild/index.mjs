#!/usr/bin/env tsx

// src/scripts/prebuild/index.ts
import { Thoth_Server } from "@iliad.dev/thoth";
var thoth = new Thoth_Server({
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
var testLog = thoth.$log("Hello, world!");
var error = testLog._warn("Test warning!")._error("Test error!").info("sibling1").info("sibling2");
var rootTest = thoth.log("Testing");
rootTest._info("Testing A");
rootTest._info("Testing B");
var nestedError = error.$log("Nested power logger");
nestedError._info("Nested info!");
setTimeout(() => {
  testLog.succeed("Test success!")._info("double success");
  setTimeout(() => {
    nestedError.succeed("Test success!")._info("final success");
  }, 4e3);
}, 1e3);
