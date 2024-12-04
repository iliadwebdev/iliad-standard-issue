// Types
import type { FinalLogConfig, LoggerConfig } from "@classes/ThothLog/types.ts";
import type { ThothParams } from "./types.ts";

// Data
import {
  defaultFinalLogConfig,
  defaultLoggerConfig,
} from "@classes/ThothLog/data.ts";

// Classes
import {
  ThothLogClient,
  PowerLogClient,
  SubLogClient,
} from "@classes/ThothLog/client.ts";
import { TimeStampClient } from "@classes/TimeStamp/client.ts";

// Utils
import { mergeDefaults } from "@iliad.dev/ts-utils";
import deepmerge from "deepmerge/index.js";
import chalk from "chalk";

// Thoth Utils
import * as u1 from "./utils.ts";
import * as u0 from "@utils";
const u = { ...u0, ...u1 };

const defaultThothParams: ThothParams = {
  config: defaultLoggerConfig,
  customTypes: [],
};

export class ClientThoth {
  // Expose chalk for easy access
  public static chalk = chalk;
  public chalk = chalk;

  config: LoggerConfig = defaultLoggerConfig;

  constructor(params: ThothParams = defaultThothParams) {
    const { config } = params;

    config &&
      (this.config = deepmerge(defaultLoggerConfig, config, u.dmo) as any);
  }

  get logger(): ThothLogClient {
    return new ThothLogClient({ config: this.config });
  }

  protected i_log(config: FinalLogConfig, ...args: any[]): ThothLogClient {
    const mergedConfig: FinalLogConfig = mergeDefaults(
      defaultFinalLogConfig,
      config
    ) as any;

    return this.logger.i_log(mergedConfig, ...args);
  }

  // Proxy methods
  public clear() {
    console.clear();
  }

  public timestamp(timestamp?: TimeStampClient) {
    return this.logger.timestamp(timestamp);
  }

  public log(...args: any[]): ClientThoth {
    const logger = this.i_log({ type: "log" }, ...args);
    return this;
  }

  public info(...args: any[]): ClientThoth {
    const logger = this.i_log({ type: "info" }, ...args);
    return this;
  }

  public warn(...args: any[]): ClientThoth {
    const logger = this.i_log({ type: "warn" }, ...args);
    return this;
  }

  public error(...args: any[]): ClientThoth {
    const logger = this.i_log({ type: "error" }, ...args);
    return this;
  }

  public debug(...args: any[]): ClientThoth {
    const logger = this.i_log({ type: "debug" }, ...args);
    return this;
  }

  // Proxy methods - Sub
  public _log(...args: any[]): SubLogClient {
    const logger = this.i_log({ type: "log", ext: "subLogger" }, ...args);
    return logger as SubLogClient;
  }

  public _info(...args: any[]): SubLogClient {
    const logger = this.i_log({ type: "info", ext: "subLogger" }, ...args);
    return logger as SubLogClient;
  }

  public _warn(...args: any[]): SubLogClient {
    const logger = this.i_log({ type: "warn", ext: "subLogger" }, ...args);
    return logger as SubLogClient;
  }

  public _error(...args: any[]): SubLogClient {
    const logger = this.i_log({ type: "error", ext: "subLogger" }, ...args);
    return logger as SubLogClient;
  }

  public _debug(...args: any[]): SubLogClient {
    const logger = this.i_log({ type: "debug", ext: "subLogger" }, ...args);
    return logger as SubLogClient;
  }

  // Proxy methods - Power
  public $log(...args: any[]): PowerLogClient {
    const logger = this.i_log({ type: "log", ext: "powerLogger" }, ...args);
    return logger as PowerLogClient;
  }

  public $info(...args: any[]): PowerLogClient {
    const logger = this.i_log({ type: "info", ext: "powerLogger" }, ...args);
    return logger as PowerLogClient;
  }

  public $warn(...args: any[]): PowerLogClient {
    const logger = this.i_log({ type: "warn", ext: "powerLogger" }, ...args);
    return logger as PowerLogClient;
  }

  public $error(...args: any[]): PowerLogClient {
    const logger = this.i_log({ type: "error", ext: "powerLogger" }, ...args);
    return logger as PowerLogClient;
  }

  public $debug(...args: any[]): PowerLogClient {
    const logger = this.i_log({ type: "debug", ext: "powerLogger" }, ...args);
    return logger as PowerLogClient;
  }
}
