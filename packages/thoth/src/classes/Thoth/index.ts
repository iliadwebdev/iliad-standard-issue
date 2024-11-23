import { mergeDefaults } from "@iliad.dev/ts-utils";
import { defaultFinalLogConfig, defaultLoggerConfig } from "./data";
import chalk from "chalk";
import ora from "ora";

import type {
  FinalLogConfig,
  LoggerConfig,
  LoggerParams,
  ThothParams,
} from "./types";

const defaultLoggerParams: DefaultParams<LoggerParams> = {
  config: defaultLoggerConfig,
};

class Logger {
  public static chalk = chalk; // Re-export chalk for convenience
  public static ora = ora; // Re-export ora for convenience

  private config: Recursive_Required<LoggerConfig>;

  constructor(params: LoggerParams) {
    const { config }: Recursive_Required<LoggerParams> =
      mergeDefaults<LoggerParams>(defaultLoggerParams, params as any);

    this.config = mergeDefaults<Recursive_Required<LoggerConfig>>(
      defaultLoggerConfig, // Not interested in battling typescript rn
      config as Recursive_Required<LoggerConfig>
    );
  }

  private getPrefix(): string {
    return chalk.hex("#00ace0")(this.getPrefix);
  }

  // LOGGING METHODS
  protected _log(config: FinalLogConfig, ...args: any[]): void {
    console.log(this.getPrefix(), ...args);
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
}

const defaultThothParams: ThothParams = {
  config: defaultLoggerConfig,
  customTypes: [],
};

class Thoth extends Logger {
  constructor(params: ThothParams = defaultThothParams) {
    super(params);
  }

  protected _log(config: FinalLogConfig, ...args: any[]): void {
    const mergedConfig = mergeDefaults<FinalLogConfig>(
      defaultFinalLogConfig,
      config
    );

    super._log(mergedConfig, ...args);
  }

  // Proxy methods
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
}

export default new Thoth();
// defaultThothInstanceProps
export { Thoth };

export function overrideConsole(instance: Thoth = new Thoth()): Thoth {
  Object.assign(console, instance);
  return instance;
}
