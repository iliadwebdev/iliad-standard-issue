// Types
import type { FinalLogConfig } from "@classes/Logger/types";
import type { ThothParams } from "./types";

// Data
import {
  defaultFinalLogConfig,
  defaultLoggerConfig,
} from "@classes/Logger/data";

// Classes
import { Logger } from "@classes/Logger";

// Utils
import { mergeDefaults } from "@iliad.dev/ts-utils";

import * as u1 from "./utils";
import * as u0 from "@utils";
const u = { ...u0, ...u1 };

const defaultThothParams: ThothParams = {
  config: defaultLoggerConfig,
  customTypes: [],
};

class Thoth {
  private logger: Logger;

  constructor(params: ThothParams = defaultThothParams) {
    const { config, customTypes } = params;
    this.logger = new Logger({ config });
  }

  protected _log(config: FinalLogConfig, ...args: any[]): void {
    const mergedConfig = mergeDefaults<FinalLogConfig>(
      defaultFinalLogConfig,
      // @ts-ignore
      config
    );
    // @ts-ignore
    this.logger._log(mergedConfig, ...args);
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
  // Object.assign(console, instance);
  return instance;
}
