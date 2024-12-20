// // Types
// import type { FinalLogConfig, LoggerConfig } from "@classes/ThothLog/types.ts";
// import type { ThothParams, ModuleParam } from "./types.ts";

import { Configuration } from "@classes/Configuration/index.ts";
import { ThothConfigInput } from "@classes/Configuration/types.ts";
import { DOM } from "@classes/DOM/class.ts";
import { Log, ThothLog } from "@classes/Log/index.ts";

// // Data
// import {
//   defaultFinalLogConfig,
//   defaultLoggerConfig,
// } from "@classes/ThothLog/data.ts";

// // Classes
// import { ThothLog, PowerLog, SubLog } from "@classes/ThothLog/server.tsx";
// import { ThothDOM } from "@classes/ThothDOM/index.tsx";
// import { TimeStamp } from "@classes/TimeStamp/server.ts";

// // Utils
// import { mergeDefaults } from "@iliad.dev/ts-utils";
// import deepmerge from "deepmerge/index.js";
// import chalk from "chalk";

// // Thoth Utils
// import * as u1 from "./utils.ts";
// import * as u0 from "@utils";
// const u = { ...u0, ...u1 };

// const defaultThothParams: ThothParams = {
//   config: defaultLoggerConfig,
//   customTypes: [],
// };

// export class Thoth {
//   // Expose chalk for easy access
//   public static chalk = chalk;
//   public chalk = chalk;

//   config: LoggerConfig = defaultLoggerConfig;
//   private DOM: ThothDOM;

//   constructor(params: ThothParams = defaultThothParams) {
//     const { config } = params;

//     config &&
//       (this.config = deepmerge(defaultLoggerConfig, config, u.dmo) as any);

//     this.DOM = new ThothDOM(this);
//   }

//   get logger(): ThothLog {
//     const logger = new ThothLog({ config: this.config }, this.DOM);
//     logger.isRoot = true;
//     return logger;
//   }

//   protected i_log(config: FinalLogConfig, ...args: any[]): ThothLog {
//     const mergedConfig: FinalLogConfig = mergeDefaults(
//       defaultFinalLogConfig,
//       config
//     ) as any;

//     return this.logger.i_log(mergedConfig, ...args);
//   }

//   public unmount() {
//     this.DOM.unmount();
//   }

//   public remount() {
//     this.DOM.mount();
//   }

//   public module(module: ModuleParam): Thoth {
//     const moduleConfig = u.normalizeModuleConfig(module);
//     const newConfig = deepmerge(this.config, moduleConfig);
//     return new Thoth({ config: newConfig });
//   }

//   // Proxy methods
//   public clear() {
//     this.DOM.clearLogs();
//   }

//   public timestamp(timestamp?: TimeStamp) {
//     return this.logger.timestamp(timestamp);
//   }

//   public log(...args: any[]): Thoth {
//     this.i_log({ type: "log" }, ...args);
//     return this;
//   }

//   public info(...args: any[]): Thoth {
//     this.i_log({ type: "info" }, ...args);
//     return this;
//   }

//   public warn(...args: any[]): Thoth {
//     this.i_log({ type: "warn" }, ...args);
//     return this;
//   }

//   public error(...args: any[]): Thoth {
//     this.i_log({ type: "error" }, ...args);
//     return this;
//   }

//   public debug(...args: any[]): Thoth {
//     this.i_log({ type: "debug" }, ...args);
//     return this;
//   }

//   // Proxy methods - Sub
//   public _log(...args: any[]): SubLog {
//     const logger = this.i_log({ type: "log", ext: "subLogger" }, ...args);
//     return logger as SubLog;
//   }

//   public _info(...args: any[]): SubLog {
//     const logger = this.i_log({ type: "info", ext: "subLogger" }, ...args);
//     return logger as SubLog;
//   }

//   public _warn(...args: any[]): SubLog {
//     const logger = this.i_log({ type: "warn", ext: "subLogger" }, ...args);
//     return logger as SubLog;
//   }

//   public _error(...args: any[]): SubLog {
//     const logger = this.i_log({ type: "error", ext: "subLogger" }, ...args);
//     return logger as SubLog;
//   }

//   public _debug(...args: any[]): SubLog {
//     const logger = this.i_log({ type: "debug", ext: "subLogger" }, ...args);
//     return logger as SubLog;
//   }

//   // Proxy methods - Power
//   public $log(...args: any[]): PowerLog {
//     const logger = this.i_log({ type: "log", ext: "powerLogger" }, ...args);
//     return logger as PowerLog;
//   }

//   public $info(...args: any[]): PowerLog {
//     const logger = this.i_log({ type: "info", ext: "powerLogger" }, ...args);
//     return logger as PowerLog;
//   }

//   public $warn(...args: any[]): PowerLog {
//     const logger = this.i_log({ type: "warn", ext: "powerLogger" }, ...args);
//     return logger as PowerLog;
//   }

//   public $error(...args: any[]): PowerLog {
//     const logger = this.i_log({ type: "error", ext: "powerLogger" }, ...args);
//     return logger as PowerLog;
//   }

//   public $debug(...args: any[]): PowerLog {
//     const logger = this.i_log({ type: "debug", ext: "powerLogger" }, ...args);
//     return logger as PowerLog;
//   }
// }

type ThothConfigObject = ThothConfigInput & {};
export class Thoth {
  configuration: Configuration;
  private DOM: DOM;

  constructor(thothConfigObject: ThothConfigObject = {}) {
    this.configuration = new Configuration(thothConfigObject);
    this.DOM = new DOM(this.configuration);
  }

  log(...args: any[]): ThothLog {
    return this.DOM.log(...args);
  }

  _log(...args: any[]): ThothLog {
    return this.DOM._log(...args);
  }
}
