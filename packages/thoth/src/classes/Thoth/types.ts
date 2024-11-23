type LogTypes<CTS extends LogType[] = never> = {
  log: LogType;
  info: LogType;
  warn: LogType;
  error: LogType;
  debug: LogType;
} & {
  [K in CTS[number]["name"]]: CTS[number];
};

export type FinalLogConfig<CTS extends LogType[] = never> = {
  type: keyof LogTypes<CTS>;
};

type LogType = {
  name: string;
};

export type ThothParams = LoggerParams & {
  customTypes?: LogType[];
};

type TimeStampComponents = "date" | "time" | "milliseconds";

export type LoggerConfig = {
  prefix: Falsable<{
    timestamp: Falsable<{
      components: TimeStampComponents | TimeStampComponents[];
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color?: string;
    }>;
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module: Falsable<{
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color?: string;
      name: string;
    }>;
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace: Falsable<{
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color?: string;
      name: string;
    }>;
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp?: boolean;
  }>;
};

export type LoggerParams = {
  config?: Recursive_OptionalFieldsOf<LoggerConfig>;
};
