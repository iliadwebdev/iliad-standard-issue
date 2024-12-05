// import React from "react";

// // Types
// import type { LoggerParams, LoggerConfig, FinalLogConfig } from "./types.ts";
// import type { LogSignal } from "@classes/ThothDOM/types.ts";

// // Classes
// import { ThothDOM } from "@classes/ThothDOM/index.tsx";
// import { TimeStamp } from "@classes/TimeStamp/server.ts";

// // Data
// import { defaultLoggerConfig } from "./data.ts";

// // Utils
// import deepmerge from "deepmerge";
// import { uid } from "uid";
// import chalk from "chalk";

// // Components
// import { SpinnerComponent } from "./components/index.ts";

// // State
// import { addToLogs, updateLog } from "@state";

// // Thoth Utils
// import * as u0 from "@utils";
// import * as u1 from "./utils.ts";

// import { Thoth as Thoth_Server } from "../Thoth/server.ts";

// const u = { ...u0, ...u1 };

// const defaultLoggerParams: LoggerParams = {
//   config: defaultLoggerConfig,
// };

// // Depth Indicators
// const TREE_VERTICAL = "│  ";
// const TREE_BRANCH = "├─ ";
// const TREE_END = "└─ ";
// const TREE_SPACE = "   ";

// export class ThothLog {
//   public static class = "ThothLog";
//   public static chalk = chalk; // Re-export chalk for convenience

//   public class = "ThothLog";
//   public chalk = chalk;

//   protected _component: React.ReactNode | null = null;
//   public parent: ThothLog | null = null;
//   public isRoot: boolean = false;
//   public DOM: ThothDOM;
//   public uid: string;

//   // Recursion
//   public children: ThothLog[] = [];
//   public lastLevel: number = 0;
//   public root: ThothLog = this;

//   // Configuration
//   protected initParams: LoggerParams;
//   protected config: LoggerConfig;

//   constructor(params: LoggerParams, DOM?: ThothDOM) {
//     this.uid = uid(16);

//     this.initParams = params;
//     this.DOM = DOM || new ThothDOM(new Thoth_Server(this.initParams));

//     const { config = {} }: LoggerParams = deepmerge(
//       defaultLoggerParams,
//       params,
//       u.dmo
//     );

//     this.config = deepmerge(defaultLoggerConfig, config, u.dmo) as LoggerConfig;
//   }

//   public clear(): void {
//     this.DOM.clearLogs();
//   }

//   public parentHasSpinner(): boolean {
//     return false;
//   }

//   public timestamp(timestamp?: TimeStamp) {
//     return new TimeStamp({ parent: timestamp, log: this });
//   }

//   public get component(): React.ReactNode | null {
//     return this._component;
//   }

//   public set component(component: React.ReactNode | null) {
//     this._component = component;
//   }

//   protected getTypePrefix(type: FinalLogConfig["type"]): string {
//     const { typeColors } = this.config;

//     const colorFn = u.resolvePolymorphicColor(typeColors[type]);

//     return colorFn(
//       " " +
//         {
//           debug: "DBG",
//           error: "ERR",
//           warn: "WRN",
//           info: "INF",
//           log: "LOG",
//         }[type] +
//         "]"
//     );
//   }

//   protected getInkPrefix(config: FinalLogConfig): LogSignal["prefix"] {
//     const { prefix: prefixConfig } = this.config;
//     const prefix: LogSignal["prefix"] = {};

//     if (prefixConfig.mfgStamp.enabled) {
//       prefix.mfgStamp = chalk.hex("#00ace0")("◭");
//     }

//     if (prefixConfig.timestamp.enabled) {
//       const { components, fn, color } = prefixConfig.timestamp;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const timestamp = u.getTimestamp(components);

//       const timestampString = fn ? fn(timestamp) : timestamp;

//       prefix.timestamp = colorfn(timestampString);
//     }

//     if (prefixConfig.namespace.enabled) {
//       const { name, fn, color } = prefixConfig.namespace;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const namespaceString = fn ? fn(name) : name;

//       prefix.namespace = colorfn(namespaceString);
//     }

//     if (prefixConfig.module.enabled) {
//       const { name, fn, color } = prefixConfig.module;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const moduleString = fn ? fn(name) : name;

//       prefix.module = colorfn(moduleString);
//     }

//     if (prefixConfig.showTypes) {
//       prefix.type = this.getTypePrefix(config.type);
//     }

//     if (this.depth > 0) {
//       prefix.depth = `${this.getDepthPrefix(true)}`;
//     }

//     return prefix;
//   }

//   public registerChild(child: ThothLog) {
//     this.children.push(child);
//   }

//   protected getDepthPrefix(_?: boolean): string {
//     return "";
//   }

//   get depth(): number {
//     return 0;
//   }

//   protected getRecursiveLogger(config: FinalLogConfig): ThothLog {
//     // if (config.ext === "powerLogger") {
//     //   if (this.isRoot) {
//     //     // Top-level PowerLog
//     //     return new PowerLog(null, this.initParams);
//     //   } else {
//     //     // Nested PowerLog
//     //     return new PowerLog(this, this.initParams);
//     //   }
//     // } else if (config.ext === "subLogger") {
//     //   if (this.isRoot) {
//     //     // Top-level SubLog
//     //     return new SubLog(null, this.initParams);
//     //   } else {
//     //     // Nested SubLog
//     //     return new SubLog(this, this.initParams);
//     //   }
//     // } else {
//     //   return new ThothLog(this.initParams, this.DOM);
//     // }
//     if (config.ext === "powerLogger") {
//       if (this.isRoot) {
//         // Top-level PowerLog
//         return new PowerLog(null, this.initParams);
//       } else {
//         // Nested PowerLog
//         return new PowerLog(this, this.initParams);
//       }
//     } else {
//       if (this.isRoot) {
//         // Return this for top-level logs
//         return this;
//       } else {
//         // For logs under a non-root, return a SubLog
//         return new SubLog(this, this.initParams);
//       }
//     }
//   }

//   // LOGGING METHODS
//   public i_log<T extends FinalLogConfig>(config: T, ...args: any[]) {
//     const logger = this.getRecursiveLogger(config);
//     return logger.finalLog({ ...config }, ...args);
//   }

//   protected i_debug(...args: any[]): ThothLog {
//     u.log(...args);
//     return this;
//   }

//   // public finalLog(config: FinalLogConfig, ...args: any[]): ThothLog {
//   //   addToLogs({
//   //     prefix: this.getInkPrefix(config),
//   //     message: args,
//   //     uid: this.uid,
//   //   });

//   //   this.lastLevel++;
//   //   return this;
//   // }

//   public finalLog(config: FinalLogConfig, ...args: any[]): ThothLog {
//     const logUid = uid(16);
//     addToLogs({
//       prefix: this.getInkPrefix(config),
//       message: args,
//       uid: logUid,
//     });

//     this.lastLevel++;
//     return this;
//   }

//   // INSTANTIATION METHODS
//   public static from(logger: ThothLog): ThothLog {
//     const newLogger = new ThothLog(logger.initParams, logger.DOM);
//     Object.assign(newLogger, logger);
//     return newLogger;
//   }

//   public from(logger: ThothLog) {
//     return ThothLog.from(logger);
//   }

//   public copy(logger: ThothLog = this) {
//     return ThothLog.from(logger);
//   }

//   // Proxy methods - Standard
//   public log(...args: any[]): ThothLog {
//     return this.i_log({ type: "log" }, ...args);
//   }

//   public info(...args: any[]): ThothLog {
//     return this.i_log({ type: "info" }, ...args);
//   }

//   public warn(...args: any[]): ThothLog {
//     return this.i_log({ type: "warn" }, ...args);
//   }

//   public error(...args: any[]): ThothLog {
//     return this.i_log({ type: "error" }, ...args);
//   }

//   public debug(...args: any[]): ThothLog {
//     return this.i_log({ type: "debug" }, ...args);
//   }

//   // Proxy methods - Sub
//   public _log(...args: any[]): SubLog {
//     return this.i_log({ type: "log", ext: "subLogger" }, ...args) as SubLog;
//   }

//   public _info(...args: any[]): SubLog {
//     return this.i_log({ type: "info", ext: "subLogger" }, ...args) as SubLog;
//   }

//   public _warn(...args: any[]): SubLog {
//     return this.i_log({ type: "warn", ext: "subLogger" }, ...args) as SubLog;
//   }

//   public _error(...args: any[]): SubLog {
//     return this.i_log({ type: "error", ext: "subLogger" }, ...args) as SubLog;
//   }

//   public _debug(...args: any[]): SubLog {
//     return this.i_log({ type: "debug", ext: "subLogger" }, ...args) as SubLog;
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

//   public isLastChild(): boolean {
//     if (!this.parent) return true;
//     const siblings = this.parent.children;
//     return siblings[siblings.length - 1] === this;
//   }
// }

// export class SubLog extends ThothLog {
//   public parent: ThothLog | null;

//   constructor(parent: ThothLog | null, params: LoggerParams) {
//     super(params, parent?.DOM);
//     this.parent = parent;

//     if (this.parent) {
//       this.root = this.parent.root; // Get the top-level parent;
//       this.parent.registerChild(this);
//     } else {
//       // Top-level SubLog
//       this.root = this;
//     }
//   }

//   get depth(): number {
//     if (!this.parent) {
//       return 0;
//     } else {
//       return this.parent.depth + 1;
//     }
//   }

//   public isLastChild(): boolean {
//     if (!this.parent) return true;
//     const siblings = this.parent.children;
//     return siblings[siblings.length - 1] === this;
//   }

//   protected getDepthPrefix(showChar: boolean = true): string {
//     if (this.depth === 0) {
//       return "";
//     }
//     let prefix = "";

//     // Build the prefix based on ancestor hierarchy
//     let ancestor = this.parent;
//     const lines = [];

//     while (ancestor && ancestor.depth > 0) {
//       let spacer = ancestor.isLastChild() ? TREE_SPACE : TREE_VERTICAL;

//       // Add extra spaces if the ancestor has a spinner
//       if (ancestor.parentHasSpinner()) {
//         spacer = "   " + spacer; // Add extra spaces
//       }

//       lines.unshift(spacer);
//       ancestor = ancestor.parent;
//     }

//     prefix += lines.join("");

//     // Add the branch or end character
//     prefix += this.isLastChild() ? TREE_END : TREE_BRANCH;

//     // Add extra spaces if the parent has a spinner
//     if (this.parentHasSpinner()) {
//       prefix = "   " + prefix; // Add extra spaces
//     }

//     return prefix;
//   }

//   // In SubLog class
//   public parentHasSpinner(): boolean {
//     return this.parent instanceof PowerLog && !this.parent.resolved;
//   }
// }

// // POWER LOGGER
// export class PowerLog extends ThothLog {
//   public parent: ThothLog | null;
//   public resolved: boolean = false;
//   public logUid: string = uid(16);

//   constructor(parent: ThothLog | null, params: LoggerParams) {
//     super(params, parent?.DOM);
//     this.parent = parent;

//     if (this.parent) {
//       this.root = this.parent.root; // Get the top-level parent;
//       this.parent.registerChild(this);
//     } else {
//       // Top-level PowerLog
//       this.root = this;
//     }
//   }

//   get depth(): number {
//     if (!this.parent) {
//       return 0;
//     } else {
//       return this.parent.depth + 1;
//     }
//   }

//   public isLastChild(): boolean {
//     if (!this.parent) return true;
//     const siblings = this.parent.children;
//     return siblings[siblings.length - 1] === this;
//   }

//   protected get spinner(): React.ReactNode {
//     return this.component;
//   }

//   protected set spinner(spinner: React.ReactNode) {
//     this.component = spinner;
//   }

//   protected getDepthPrefix(showChar: boolean = true): string {
//     if (this.depth === 0) {
//       return "";
//     }
//     let prefix = "";

//     // Build the prefix based on ancestor hierarchy
//     let ancestor = this.parent;
//     const lines = [];

//     while (ancestor && ancestor.depth > 0) {
//       let spacer = ancestor.isLastChild() ? TREE_SPACE : TREE_VERTICAL;

//       // Add extra spaces if the ancestor has a spinner
//       if (ancestor.parentHasSpinner()) {
//         spacer = "   " + spacer; // Add extra spaces
//       }

//       lines.unshift(spacer);
//       ancestor = ancestor.parent;
//     }

//     prefix += lines.join("");

//     // Add the branch or end character
//     prefix += this.isLastChild() ? TREE_END : TREE_BRANCH;

//     // Add extra spaces if the parent has a spinner
//     if (this.parentHasSpinner()) {
//       prefix = "   " + prefix; // Add extra spaces
//     }

//     return prefix;
//   }

//   // In PowerLog class
//   public finalLog(config: FinalLogConfig, ...args: any[]): PowerLog {
//     if (config.ext === "powerLogger") {
//       this.logUid = uid(16);
//       addToLogs({
//         prefix: this.getInkPrefix({ ...config, spinner: true }),
//         spinner: <SpinnerComponent />,
//         message: args,
//         uid: this.logUid,
//       });
//       this.lastLevel++;
//       return this;
//     } else {
//       return super.finalLog(config, ...args) as PowerLog;
//     }
//   }

//   public succeedAll(text: string, recursive: boolean = true): PowerLog {
//     if (this.children.length <= 0) {
//       return this.succeed(text);
//     }

//     for (let child of this.children) {
//       if (!(child instanceof PowerLog)) continue;
//       if (child.resolved) continue;

//       if (recursive) {
//         child.succeedAll(text, true);
//       } else {
//         child.succeed(text);
//       }
//     }

//     return this.succeed(text);
//   }

//   public parentHasSpinner(): boolean {
//     // Since this is the PowerLog itself, return false
//     return false;
//   }

//   // In PowerLog class
//   public succeed(text: string): PowerLog {
//     const props: any = {
//       spinner: <SpinnerComponent state="success" />,
//     };

//     if (text) props.message = text;
//     updateLog(this.logUid, props);

//     this.resolve();
//     return this; // Return this for chaining
//   }

//   private resolve(): PowerLog {
//     this.resolved = true;
//     return this;
//   }

//   public fail(text: string): PowerLog {
//     const props: Partial<LogSignal> = {
//       spinner: <SpinnerComponent state="error" />,
//       prefix: {
//         type: this.getTypePrefix("error"),
//       },
//     };

//     if (text) props.message = text;
//     updateLog(this.logUid, props);

//     this.resolve();
//     return this;
//   }

//   public update(text: string): PowerLog {
//     updateLog(this.logUid, {
//       message: text,
//     });

//     return this;
//   }
// }
