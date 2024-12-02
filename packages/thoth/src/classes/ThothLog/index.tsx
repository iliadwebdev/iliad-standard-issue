import React from "react";

// Types
import type { LoggerParams, LoggerConfig, FinalLogConfig } from "./types.ts";
import type { LogSignal } from "@classes/ThothDOM/types.ts";

// Classes
import { ThothDOM } from "@classes/ThothDOM/index.tsx";
import { TimeStamp } from "@classes/TimeStamp.ts";

// Data
import { defaultLoggerConfig } from "./data.ts";

// Utils
import deepmerge from "deepmerge";
import { uid } from "uid";
import chalk from "chalk";
import util from "util";

// Components
import { SpinnerComponent } from "./components/index.ts";

// State
import { addToLogs, updateLog } from "@state";

// Thoth Utils
import * as u0 from "@utils";
import * as u1 from "./utils.ts";
const u = { ...u0, ...u1 };

const defaultLoggerParams: LoggerParams = {
  config: defaultLoggerConfig,
};

// Depth Indicators
const DEPTH_SAME = "▶";
const DEPTH_DEEPER = "∟";

export class ThothLog {
  public static class = "ThothLog";
  public static chalk = chalk; // Re-export chalk for convenience

  public class = "ThothLog";
  public chalk = chalk;

  protected _component: React.ReactNode | null = null;
  public DOM: ThothDOM;
  public uid: string;

  // Recursion
  public children: (ThothLog | PowerLog | SubLog)[] = [];
  public lastLevel: number = 0;
  public root: ThothLog = this;

  // Configuration
  private initParams: LoggerParams;
  private config: LoggerConfig;

  constructor(params: LoggerParams, DOM: ThothDOM) {
    this.uid = uid(16);

    this.initParams = params;
    this.DOM = DOM;

    const { config = {} }: LoggerParams = deepmerge(
      defaultLoggerParams,
      params,
      u.dmo
    );

    this.config = deepmerge(defaultLoggerConfig, config, u.dmo) as LoggerConfig;
  }

  public clear(): void {
    this.DOM.clearLogs();
  }

  public timestamp(timestamp?: TimeStamp) {
    return new TimeStamp({ parent: timestamp, log: this });
  }

  public get component(): React.ReactNode | null {
    return this._component;
  }

  public set component(component: React.ReactNode | null) {
    this._component = component;
  }

  protected getInkPrefix(config: FinalLogConfig): LogSignal["prefix"] {
    const { prefix: prefixConfig, typeColors } = this.config;
    const prefix: LogSignal["prefix"] = {};

    if (prefixConfig.mfgStamp.enabled) {
      prefix.mfgStamp = chalk.hex("#00ace0")("◭");
    }

    if (prefixConfig.timestamp.enabled) {
      const { components, fn, color } = prefixConfig.timestamp;

      const colorfn = u.resolvePolymorphicColor(color);
      const timestamp = u.getTimestamp(components);

      const timestampString = fn ? fn(timestamp) : timestamp;

      prefix.timestamp = colorfn(timestampString);
    }

    if (prefixConfig.namespace.enabled) {
      const { name, fn, color } = prefixConfig.namespace;

      const colorfn = u.resolvePolymorphicColor(color);
      const namespaceString = fn ? fn(name) : name;

      prefix.namespace = colorfn(namespaceString);
    }

    if (prefixConfig.module.enabled) {
      const { name, fn, color } = prefixConfig.module;

      const colorfn = u.resolvePolymorphicColor(color);
      const moduleString = fn ? fn(name) : name;

      prefix.module = colorfn(moduleString);
    }

    if (prefixConfig.showTypes) {
      const colorFn = u.resolvePolymorphicColor(typeColors[config.type]);
      const padFn = u.resolvePadType(prefixConfig.padType);
      const stStr = padFn(`[${config.type}]`, 6).toUpperCase();

      prefix.type = colorFn(stStr);
    }

    if (this.depth) {
      prefix.depth = `${this.getDepthPrefix(true)}`;
    }

    return prefix;
  }

  protected getPrefix(config: FinalLogConfig): string {
    const { prefix: prefixConfig, typeColors } = this.config;
    const prefixes = [];

    if (prefixConfig.mfgStamp.enabled) {
      prefixes.push(chalk.hex("#00ace0")("◭"));
    }

    if (prefixConfig.timestamp.enabled) {
      const { components, fn, color } = prefixConfig.timestamp;

      const colorfn = u.resolvePolymorphicColor(color);
      const timestamp = u.getTimestamp(components);

      const timestampString = fn ? fn(timestamp) : timestamp;

      prefixes.push(colorfn(timestampString));
    }

    if (prefixConfig.namespace.enabled) {
      const { name, fn, color } = prefixConfig.namespace;

      const colorfn = u.resolvePolymorphicColor(color);
      const namespaceString = fn ? fn(name) : name;

      prefixes.push(colorfn(namespaceString));
    }

    if (prefixConfig.module.enabled) {
      const { name, fn, color } = prefixConfig.module;

      const colorfn = u.resolvePolymorphicColor(color);
      const moduleString = fn ? fn(name) : name;

      prefixes.push(colorfn(moduleString));
    }

    if (prefixConfig.showTypes) {
      const colorFn = u.resolvePolymorphicColor(typeColors[config.type]);
      const padFn = u.resolvePadType(prefixConfig.padType);
      const stStr = padFn(`[${config.type}]`, 6).toUpperCase();

      prefixes.push(colorFn(stStr));
    }

    let joinedPrefixes = prefixes.join(prefixConfig.joinString);
    if (prefixConfig.newLine) joinedPrefixes += "\n ";

    if (this.depth) {
      joinedPrefixes += this.getDepthPrefix(!config.spinner);
    }

    return joinedPrefixes;
  }

  public registerChild(child: ThothLog) {
    this.children.push(child);
  }

  protected getDepthPrefix(_?: boolean): string {
    return "";
  }

  get depth(): number {
    return 0;
  }

  protected getRecursiveLogger(config: FinalLogConfig): ThothLog {
    if (config.ext === "powerLogger") {
      return new PowerLog(this, this.initParams);
    } else if (config.ext === "subLogger") {
      return new SubLog(this, this.initParams);
    } else {
      // return new ThothLog(this.initParams, this.DOM);
      return this;
    }
    // }

    // return new SubLog(this, this.initParams);
  }

  // LOGGING METHODS
  public i_log<T extends FinalLogConfig>(config: T, ...args: any[]) {
    const logger = this.getRecursiveLogger(config);
    return logger.finalLog({ ...config }, ...args);
  }
  protected i_debug(...args: any[]): ThothLog | PowerLog | SubLog {
    u.log(...args);
    return this;
  }

  protected toUint8(...components: string[]): Uint8Array {
    return u.formatToUint8Array(components);
  }

  public finalLog(config: FinalLogConfig, ...args: any[]): ThothLog {
    addToLogs({
      prefix: this.getInkPrefix(config),
      message: args,
      uid: uid(16),
    });

    this.lastLevel++;
    return this;
  }

  // INSTANTIATION METHODS
  public static from(logger: ThothLog): ThothLog {
    const newLogger = new ThothLog(logger._params, logger.DOM);
    Object.assign(newLogger, logger);
    return newLogger;
  }

  protected get _params(): LoggerParams {
    return { config: this.config };
  }

  public from(logger: ThothLog) {
    return ThothLog.from(logger);
  }

  public copy(logger: ThothLog = this) {
    return ThothLog.from(logger);
  }

  // Proxy methods - Standard
  public log(...args: any[]): ThothLog | PowerLog | SubLog {
    return this.i_log({ type: "log" }, ...args);
  }

  public info(...args: any[]): ThothLog | PowerLog | SubLog {
    return this.i_log({ type: "info" }, ...args);
  }

  public warn(...args: any[]): ThothLog | PowerLog | SubLog {
    return this.i_log({ type: "warn" }, ...args);
  }

  public error(...args: any[]): ThothLog | PowerLog | SubLog {
    return this.i_log({ type: "error" }, ...args);
  }

  public debug(...args: any[]): ThothLog | PowerLog | SubLog {
    return this.i_log({ type: "debug" }, ...args);
  }

  // Proxy methods - Power
  public $log(...args: any[]): PowerLog {
    const logger = this.i_log({ type: "log", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $info(...args: any[]): PowerLog {
    const logger = this.i_log({ type: "info", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $warn(...args: any[]): PowerLog {
    const logger = this.i_log({ type: "warn", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $error(...args: any[]): PowerLog {
    const logger = this.i_log({ type: "error", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $debug(...args: any[]): PowerLog {
    const logger = this.i_log({ type: "debug", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }
}

class SubLog extends ThothLog {
  private parent: ThothLog;

  constructor(parent: ThothLog, params: LoggerParams) {
    super(params, parent.DOM);

    this.parent = parent;
    this.root = parent.root; // Get the top-level parent;

    this.parent.registerChild(this);
  }

  get depth(): number {
    return this.parent.depth + 1;
  }

  private getDepthChar(): string {
    if (this.depth === 1) return DEPTH_SAME;

    if (this.depth >= this.root.lastLevel) {
      return DEPTH_DEEPER;
    }

    return DEPTH_SAME;
  }

  protected getDepthPrefix(showChar: boolean = true): string {
    let prefix = "  ".repeat(this.depth);

    if (showChar) prefix += this.getDepthChar();

    return prefix;
  }
}

// POWER LOGGER
export class PowerLog extends SubLog {
  private initialConfig?: FinalLogConfig;
  public resolved: boolean = false;
  public logUid: string = uid(16);

  constructor(parent: ThothLog, params: LoggerParams) {
    super(parent, params);
  }

  protected get spinner(): React.ReactNode {
    return this.component;
  }

  protected set spinner(spinner: React.ReactNode) {
    this.component = spinner;
  }

  public finalLog(config: FinalLogConfig, ...args: any[]): PowerLog | ThothLog {
    if (config.ext === "powerLogger") {
      // This is the initial spinner message
      this.logUid = this.uid; // Use this.uid to update the spinner later
      addToLogs({
        prefix: this.getInkPrefix({ ...config, spinner: true }),
        spinner: <SpinnerComponent />,
        message: args,
        uid: this.logUid,
      });
      this.lastLevel++;
      return this;
    } else {
      // Delegate other log types to ThothLog
      return super.finalLog(config, ...args);
    }
  }

  public succeedAll(text: string, recursive: boolean = true): PowerLog {
    // this.log(this.children);

    if (this.children.length <= 0) {
      return this.succeed(text);
    }

    for (let child of this.children) {
      if (!(child instanceof PowerLog)) continue;
      if (child.resolved) continue;

      if (recursive) {
        child.succeedAll(text, true);
      } else {
        child.succeed(text);
      }
    }

    return this.succeed(text);
  }

  public succeed(text: string): PowerLog {
    const props: any = {
      spinner: <SpinnerComponent state="success" />,
    };

    if (text) props.message = text;
    updateLog(this.logUid, props);

    return this.resolve();
  }

  private resolve(): PowerLog {
    this.resolved = true;
    return this;
  }

  public fail(text: string): PowerLog {
    const props: any = {
      spinner: <SpinnerComponent state="error" />,
    };

    if (text) props.message = text;
    updateLog(this.logUid, props);

    return this.resolve();
  }

  public update(text: string): PowerLog {
    updateLog(this.logUid, {
      message: text,
    });

    return this.resolve();
  }
}
