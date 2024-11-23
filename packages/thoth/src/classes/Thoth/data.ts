import type { FinalLogConfig, LoggerConfig } from "./types";

export const defaultThothInstanceProps = {};
export const defaultFinalLogConfig: FinalLogConfig = {
  type: "log",
};

export const defaultLoggerConfig: Recursive_Required<LoggerConfig> = {
  prefix: {
    timestamp: {
      components: ["date", "time"],
      color: "gray",
      fn: undefined,
    },
    module: {
      name: "Thoth",
      color: "#00ace0",
      fn: undefined,
    },
    namespace: {
      name: "Thoth",
      color: "#00ace0",
      fn: undefined,
    },
    mfgStamp: true,
  },
};
