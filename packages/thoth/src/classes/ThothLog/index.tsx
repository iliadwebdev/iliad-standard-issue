import React from "react";
// Types
import type {
  LoggerParams,
  LoggerConfig,
  FinalLogConfig,
  LogType,
  LogTypes,
} from "./types.ts";
import type { Ora } from "ora";

// Data
import { defaultLoggerConfig } from "./data.ts";

// Utils
import deepmerge from "deepmerge";
import { uid } from "uid";
import chalk from "chalk";
import util from "util";
import ora from "ora";

// Components
import {
  createSpinner,
  SpinnerComponent,
  BasicLog,
} from "./components/index.ts";

// Thoth Utils
import * as u0 from "@utils";
import * as u1 from "./utils.ts";
import { Thoth } from "@classes/Thoth/index.ts";
import { ThothDOM } from "@classes/ThothDOM/index.tsx";
const u = { ...u0, ...u1 };

const defaultLoggerParams: LoggerParams = {
  config: defaultLoggerConfig,
};

const dmo = {
  arrayMerge: u.overwriteMerge,
};

// Depth Indicators
const DEPTH_SAME = "▶";
const DEPTH_DEEPER = "∟";

export class ThothLog {
  public static class = "ThothLog";
  public static chalk = chalk; // Re-export chalk for convenience
  public static ora = ora; // Re-export ora for convenience

  protected _component: React.ReactNode | null = null;
  public DOM: ThothDOM;
  public uid: string;

  // Recursion
  public children: ThothLog[] = [];
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
      dmo
    );

    this.config = deepmerge(defaultLoggerConfig, config, dmo) as LoggerConfig;

    this.registerSelfToDOM();
  }

  private registerSelfToDOM() {
    this.DOM.registerLogger(this);
  }

  protected updateDOMState() {
    this.DOM.updateLogger(this);
  }

  public get component(): React.ReactNode | null {
    return this._component;
  }

  public set component(component: React.ReactNode | null) {
    this._component = component;
    this.updateDOMState();
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
      const stStr = padFn(config.type, 5).toUpperCase();

      prefixes.push(colorFn(`[${stStr}]`));
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
      return this;
    }
  }

  // LOGGING METHODS
  protected _log<T extends FinalLogConfig>(config: T, ...args: any[]) {
    const logger = this.getRecursiveLogger(config);
    return logger.finalLog(config, ...args);
  }

  protected toUint8(...components: string[]): Uint8Array {
    return u.formatToUint8Array(components);
  }

  public finalLog(config: FinalLogConfig, ...args: any[]): ThothLog {
    this.component = (
      <BasicLog
        key={this.uid}
        components={[this.getPrefix(config), util.format(...args)]}
      />
    );
    this.lastLevel++;

    this.DOM.refresh();
    // const buffer = this.toUint8(this.getPrefix(config), ...args);
    // process.stdout.write(buffer);
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
  public log(...args: any[]): void {
    this._log({ type: "log" }, ...args);
  }

  public info(...args: any[]): void {
    this._log({ type: "info" }, ...args);
  }

  public warn(...args: any[]): void {
    this._log({ type: "warn" }, ...args);
  }

  public error(...args: any[]): void {
    this._log({ type: "error" }, ...args);
  }

  public debug(...args: any[]): void {
    this._log({ type: "debug" }, ...args);
  }

  // Proxy methods - Power
  public $log(...args: any[]): PowerLog {
    const logger = this._log({ type: "log", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $info(...args: any[]): PowerLog {
    const logger = this._log({ type: "info", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $warn(...args: any[]): PowerLog {
    const logger = this._log({ type: "warn", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $error(...args: any[]): PowerLog {
    const logger = this._log({ type: "error", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }

  public $debug(...args: any[]): PowerLog {
    const logger = this._log({ type: "debug", ext: "powerLogger" }, ...args);
    return logger as PowerLog;
  }
}

class SubLog extends ThothLog {
  private parent: ThothLog;

  constructor(parent: ThothLog, params: LoggerParams) {
    super(params, parent.DOM);
    super.registerChild(this);

    this.parent = parent;
    this.root = parent.root; // Get the top-level parent;
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
  public resolved: boolean = false;
  constructor(parent: ThothLog, params: LoggerParams) {
    super(parent, params);
  }

  protected get spinner(): React.ReactNode {
    return this.component;
  }

  protected set spinner(spinner: React.ReactNode) {
    this.component = spinner;
  }

  public finalLog(config: FinalLogConfig, ...args: any[]): PowerLog {
    const prefixText = this.getPrefix({ ...config, spinner: true });
    const text = util.format(...args);

    this.spinner = (
      <SpinnerComponent
        prefixText={prefixText}
        key={this.uid}
        uid={this.uid}
        text={text}
      />
    );

    this.lastLevel++;
    return this;
  }

  public succeed(text: string): PowerLog {
    // this.spinner?.succeed(text);
    return this;
  }

  public fail(text: string): PowerLog {
    // this.spinner?.fail(text);
    return this;
  }

  public update(text: string): PowerLog {
    if (!this.spinner) return this;
    // this.spinner.text = text;
    return this;
  }

  private resolve(type: keyof LogTypes = "log") {
    this.component = this.resolved = true;
    this.spinner = null;
  }

  public get class() {
    return PowerLog.class;
  }
}
