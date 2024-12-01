// Types
import type { FinalLogConfig } from "@classes/ThothLog/types.ts";
import type { ThothParams } from "./types.ts";

// Data
import {
  defaultFinalLogConfig,
  defaultLoggerConfig,
} from "@classes/ThothLog/data.ts";

// Classes
import { ThothLog, PowerLog } from "@classes/ThothLog/index.tsx";
import { ThothDOM } from "@classes/ThothDOM/index.tsx";

// Utils
import { mergeDefaults } from "@iliad.dev/ts-utils";

import * as u1 from "./utils.ts";
import * as u0 from "@utils";
const u = u0._(u0, u1);

const defaultThothParams: ThothParams = {
  config: defaultLoggerConfig,
  customTypes: [],
};

class Thoth {
  // private logger: ThothLog;
  private DOM: ThothDOM;

  constructor(params: ThothParams = defaultThothParams) {
    const { config, customTypes } = params;
    this.DOM = new ThothDOM(this);

    // this.logger = new ThothLog({ config }, this.DOM);
  }

  get logger(): ThothLog {
    return new ThothLog({ config: defaultLoggerConfig }, this.DOM);
  }

  protected _log(config: FinalLogConfig, ...args: any[]): ThothLog {
    const mergedConfig = mergeDefaults<FinalLogConfig>(
      defaultFinalLogConfig,
      // @ts-ignore
      config
    );

    // @ts-ignore
    return this.logger._log(mergedConfig, ...args);
  }

  // Proxy methods
  public log(...args: any[]): void {
    this.logger.log(...args);
  }

  public info(...args: any[]): void {
    this.logger.info(...args);
  }

  public warn(...args: any[]): void {
    this.logger.warn(...args);
  }

  public error(...args: any[]): void {
    this.logger.error(...args);
  }

  public debug(...args: any[]): void {
    this.logger.debug(...args);
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

export default new Thoth();
// defaultThothInstanceProps
export { Thoth };

export function overrideConsole(instance: Thoth = new Thoth()): Thoth {
  // Object.assign(console, instance);
  return instance;
}
