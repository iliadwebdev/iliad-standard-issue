// Types
import type { LoggerParams, LoggerConfig, FinalLogConfig } from "./types";

// Data
import { defaultLoggerConfig } from "./data";

// Utils
import deepmerge from "deepmerge";
import chalk from "chalk";
import ora from "ora";

// Thoth Utils
import * as u0 from "@utils";
import * as u1 from "./utils";
const u = { ...u0, ...u1 };

const defaultLoggerParams: LoggerParams = {
  config: defaultLoggerConfig,
};

const dmo = {
  arrayMerge: u.overwriteMerge,
};

export class Logger {
  public static chalk = chalk; // Re-export chalk for convenience
  public static ora = ora; // Re-export ora for convenience

  private initParams: LoggerParams;
  private config: LoggerConfig;
  constructor(params: LoggerParams) {
    this.initParams = params;

    const { config = {} }: LoggerParams = deepmerge(
      defaultLoggerParams,
      params,
      dmo
    );

    this.config = deepmerge(defaultLoggerConfig, config, dmo) as LoggerConfig;
  }

  private getPrefix(config: FinalLogConfig): string {
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

    return joinedPrefixes;
  }

  get depth(): number {
    return 0;
  }

  // LOGGING METHODS
  protected _log(config: FinalLogConfig, ...args: any[]): void {
    if (config?.ext === "powerLogger") {
      let { ext, ...slConfig } = config;
      new PowerLogger(this, this.initParams)._log(slConfig, ...args);
    }

    if (config?.ext === "subLogger") {
      let { ext, ...slConfig } = config;
      new SubLogger(this, this.initParams)._log(slConfig, ...args);
    }

    const buffer = u.formatToUint8Array([this.getPrefix(config), ...args]);
    process.stdout.write(buffer);
  }

  // INSTANTIATION METHODS
  public static from(logger: Logger): Logger {
    const newLogger = new Logger(logger._params);
    Object.assign(newLogger, logger);
    return newLogger;
  }

  protected get _params(): LoggerParams {
    return { config: this.config };
  }

  public from(logger: Logger) {
    return Logger.from(logger);
  }

  public copy(logger: Logger = this) {
    return Logger.from(logger);
  }

  public $log(...args: any[]): void {}
}

class SubLogger extends Logger {
  private parent: Logger;

  constructor(parent: Logger, params: LoggerParams) {
    super(params);

    this.parent = parent;
  }

  get depth(): number {
    return this.parent.depth + 1;
  }
}

class PowerLogger extends SubLogger {}
