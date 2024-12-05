// // Import ora
// import ora, { Ora } from "ora";

// // Other imports remain the same
// import React from "react";

// // Types
// import type { LoggerParams, LoggerConfig, FinalLogConfig } from "./types.ts";
// import type { LogSignal } from "@classes/ThothDOM/types.ts";

// // Classes
// import { TimeStampClient } from "@classes/TimeStamp/client.ts";

// // Data
// import { defaultLoggerConfig } from "./data.ts";

// // Utils
// import deepmerge from "deepmerge";
// import { uid } from "uid";
// import chalk from "chalk";

// // State
// type LogSignalClient = LogSignal & {
//   prefix: string;
// };

// function addToLogs(logSignal: LogSignalClient) {
//   const { prefix, message } = logSignal;
//   console.log(prefix, ...message);
// }

// // Thoth Utils
// import * as u0 from "@utils";
// import * as u1 from "./utils.ts";
// const u = { ...u0, ...u1 };

// const defaultLoggerParams: LoggerParams = {
//   config: defaultLoggerConfig,
// };

// // Depth Indicators
// const DEPTH_SAME = "▶";
// const DEPTH_DEEPER = "∟";

// export class ThothLogClient {
//   public static class = "ThothLogClient";
//   public static chalk = chalk; // Re-export chalk for convenience

//   public class = "ThothLogClient";
//   public chalk = chalk;

//   protected _component: React.ReactNode | null = null;
//   public uid: string;

//   // Recursion
//   public children: (ThothLogClient | PowerLogClient | SubLogClient)[] = [];
//   public lastLevel: number = 0;
//   public root: ThothLogClient = this;

//   // Configuration
//   protected initParams: LoggerParams;
//   protected config: LoggerConfig;

//   constructor(params: LoggerParams) {
//     this.initParams = params;
//     this.uid = uid(16);

//     const { config = {} }: LoggerParams = deepmerge(
//       defaultLoggerParams,
//       params,
//       u.dmo
//     );

//     this.config = deepmerge(defaultLoggerConfig, config, u.dmo) as LoggerConfig;
//   }

//   public clear(): void {
//     console.clear();
//   }

//   public timestamp(timestamp?: TimeStampClient) {
//     return new TimeStampClient({ parent: timestamp, log: this });
//   }

//   public get component(): React.ReactNode | null {
//     return this._component;
//   }

//   public set component(component: React.ReactNode | null) {
//     this._component = component;
//   }

//   protected getTypePrefix(type: FinalLogConfig["type"]): string {
//     const { prefix: prefixConfig, typeColors } = this.config;

//     const colorFn = u.resolvePolymorphicColor(typeColors[type]);
//     const padFn = u.resolvePadType(prefixConfig.padType);

//     const stStr = padFn(`[${type}]`, 7).toUpperCase();
//     return colorFn(stStr);
//   }

//   protected getPrefix(config: FinalLogConfig): string {
//     const { prefix: prefixConfig, typeColors } = this.config;
//     const prefixes = [];

//     if (prefixConfig.mfgStamp.enabled) {
//       prefixes.push(chalk.hex("#00ace0")("◭"));
//     }

//     if (prefixConfig.timestamp.enabled) {
//       const { components, fn, color } = prefixConfig.timestamp;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const timestamp = u.getTimestamp(components);

//       const timestampString = fn ? fn(timestamp) : timestamp;

//       prefixes.push(colorfn(timestampString));
//     }

//     if (prefixConfig.namespace.enabled) {
//       const { name, fn, color } = prefixConfig.namespace;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const namespaceString = fn ? fn(name) : name;

//       prefixes.push(colorfn(namespaceString));
//     }

//     if (prefixConfig.module.enabled) {
//       const { name, fn, color } = prefixConfig.module;

//       const colorfn = u.resolvePolymorphicColor(color);
//       const moduleString = fn ? fn(name) : name;

//       prefixes.push(colorfn(moduleString));
//     }

//     if (prefixConfig.showTypes) {
//       prefixes.push(this.getTypePrefix(config.type));
//     }

//     let joinedPrefixes = prefixes.join(prefixConfig.joinString);
//     if (prefixConfig.newLine) joinedPrefixes += "\n ";

//     if (this.depth) {
//       joinedPrefixes += this.getDepthPrefix(!config.spinner);
//     }

//     return joinedPrefixes;
//   }

//   public registerChild(child: ThothLogClient) {
//     this.children.push(child);
//   }

//   protected getDepthPrefix(_?: boolean): string {
//     return "";
//   }

//   get depth(): number {
//     return 0;
//   }

//   protected getRecursiveLogger(config: FinalLogConfig): ThothLogClient {
//     if (config.ext === "powerLogger") {
//       return new PowerLogClient(this, this.initParams);
//     } else if (config.ext === "subLogger") {
//       return new SubLogClient(this, this.initParams);
//     } else {
//       return this;
//     }
//   }

//   // LOGGING METHODS
//   public i_log<T extends FinalLogConfig>(config: T, ...args: any[]) {
//     const logger = this.getRecursiveLogger(config);
//     return logger.finalLog({ ...config }, ...args);
//   }

//   protected i_debug(...args: any[]): ThothLogClient | SubLogClient {
//     u.log(...args);
//     return this;
//   }

//   protected toUint8(...components: string[]): Uint8Array {
//     return u.formatToUint8Array(components);
//   }

//   public finalLog(config: FinalLogConfig, ...args: any[]): ThothLogClient {
//     addToLogs({
//       prefix: this.getPrefix(config),
//       message: args,
//       uid: uid(16),
//     });

//     this.lastLevel++;
//     return this;
//   }

//   // INSTANTIATION METHODS
//   public static from(logger: ThothLogClient): ThothLogClient {
//     const newLogger = new ThothLogClient(logger._params);
//     Object.assign(newLogger, logger);
//     return newLogger;
//   }

//   protected get _params(): LoggerParams {
//     return { config: this.config };
//   }

//   public from(logger: ThothLogClient) {
//     return ThothLogClient.from(logger);
//   }

//   public copy(logger: ThothLogClient = this) {
//     return ThothLogClient.from(logger);
//   }

//   // Proxy methods - Standard
//   public log(...args: any[]): ThothLogClient | SubLogClient {
//     return this.i_log({ type: "log" }, ...args);
//   }

//   public info(...args: any[]): ThothLogClient | SubLogClient {
//     return this.i_log({ type: "info" }, ...args);
//   }

//   public warn(...args: any[]): ThothLogClient | SubLogClient {
//     return this.i_log({ type: "warn" }, ...args);
//   }

//   public error(...args: any[]): ThothLogClient | SubLogClient {
//     return this.i_log({ type: "error" }, ...args);
//   }

//   public debug(...args: any[]): ThothLogClient | SubLogClient {
//     return this.i_log({ type: "debug" }, ...args);
//   }

//   // Proxy methods - Sub
//   public _log(...args: any[]): SubLogClient {
//     return this.i_log(
//       { type: "log", ext: "subLogger" },
//       ...args
//     ) as SubLogClient;
//   }

//   public _info(...args: any[]): SubLogClient {
//     return this.i_log(
//       { type: "info", ext: "subLogger" },
//       ...args
//     ) as SubLogClient;
//   }

//   public _warn(...args: any[]): SubLogClient {
//     return this.i_log(
//       { type: "warn", ext: "subLogger" },
//       ...args
//     ) as SubLogClient;
//   }

//   public _error(...args: any[]): SubLogClient {
//     return this.i_log(
//       { type: "error", ext: "subLogger" },
//       ...args
//     ) as SubLogClient;
//   }

//   public _debug(...args: any[]): SubLogClient {
//     return this.i_log(
//       { type: "debug", ext: "subLogger" },
//       ...args
//     ) as SubLogClient;
//   }

//   // Proxy methods - Power
//   public $log(...args: any[]): PowerLogClient {
//     const logger = this.i_log({ type: "log", ext: "powerLogger" }, ...args);
//     return logger as PowerLogClient;
//   }

//   public $info(...args: any[]): PowerLogClient {
//     const logger = this.i_log({ type: "info", ext: "powerLogger" }, ...args);
//     return logger as PowerLogClient;
//   }

//   public $warn(...args: any[]): PowerLogClient {
//     const logger = this.i_log({ type: "warn", ext: "powerLogger" }, ...args);
//     return logger as PowerLogClient;
//   }

//   public $error(...args: any[]): PowerLogClient {
//     const logger = this.i_log({ type: "error", ext: "powerLogger" }, ...args);
//     return logger as PowerLogClient;
//   }

//   public $debug(...args: any[]): PowerLogClient {
//     const logger = this.i_log({ type: "debug", ext: "powerLogger" }, ...args);
//     return logger as PowerLogClient;
//   }
// }

// export class SubLogClient extends ThothLogClient {
//   protected parent: ThothLogClient;

//   constructor(parent: ThothLogClient, params: LoggerParams) {
//     super(params);

//     this.parent = parent;
//     this.root = parent.root; // Get the top-level parent;

//     this.parent.registerChild(this);
//   }

//   get depth(): number {
//     return this.parent.depth + 1;
//   }

//   private getDepthChar(): string {
//     if (this.depth === 1) return DEPTH_SAME;

//     if (this.depth >= this.root.lastLevel) {
//       return DEPTH_DEEPER;
//     }

//     return DEPTH_SAME;
//   }

//   protected getDepthPrefix(showChar: boolean = true): string {
//     let prefix = "  ".repeat(this.depth);

//     if (showChar) prefix += this.getDepthChar();

//     return prefix;
//   }
// }

// // POWER LOGGER
// export class PowerLogClient extends SubLogClient {
//   private initialConfig?: FinalLogConfig;
//   public resolved: boolean = false;
//   public logUid: string = uid(16);

//   private spinnerInstance: Ora | null = null;

//   constructor(parent: ThothLogClient, params: LoggerParams) {
//     super(parent, params);
//   }

//   public finalLog(
//     config: FinalLogConfig,
//     ...args: any[]
//   ): PowerLogClient | ThothLogClient {
//     if (config.ext === "powerLogger") {
//       const message = args.join(" ");
//       const prefix = this.getPrefix(config);

//       // Create a new ora spinner with the specified color
//       this.spinnerInstance = ora({
//         text: `${prefix} ${message}`,
//         color: "cyan",
//         spinner: "dots",
//       }).start();

//       // Set spinner color to #00ace0 if possible
//       (this.spinnerInstance as any).color = "#00ace0";

//       this.lastLevel++;
//       return this;
//     } else {
//       // Delegate other log types to ThothLogClient
//       return super.finalLog(config, ...args);
//     }
//   }

//   public succeedAll(text: string, recursive: boolean = true): PowerLogClient {
//     if (this.children.length <= 0) {
//       return this.succeed(text);
//     }

//     for (let child of this.children) {
//       if (!(child instanceof PowerLogClient)) continue;
//       if (child.resolved) continue;

//       if (recursive) {
//         child.succeedAll(text, true);
//       } else {
//         child.succeed(text);
//       }
//     }

//     return this.succeed(text);
//   }

//   public succeed(text: string): PowerLogClient {
//     if (this.spinnerInstance) {
//       const prefix = this.getPrefix({ type: "info" });
//       this.spinnerInstance.succeed(`${prefix} ${text}`);
//     } else {
//       console.log(text);
//     }

//     this.resolve();
//     return this;
//   }

//   private resolve(): PowerLogClient {
//     this.resolved = true;
//     return this;
//   }

//   public fail(text: string): PowerLogClient {
//     if (this.spinnerInstance) {
//       const prefix = this.getPrefix({ type: "error" });
//       this.spinnerInstance.fail(`${prefix} ${text}`);
//     } else {
//       console.error(text);
//     }

//     this.resolve();
//     return this;
//   }

//   public update(text: string): PowerLogClient {
//     if (this.spinnerInstance) {
//       const prefix = this.getPrefix(this.initialConfig || { type: "info" });
//       this.spinnerInstance.text = `${prefix} ${text}`;
//     }

//     return this;
//   }
// }
