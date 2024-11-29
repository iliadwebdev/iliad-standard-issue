import { PolymorphicColor, TimeStampComponents, PadType } from "@types";
import { LoggerParamsConfig } from "@classes/Thoth/types";

export type LogTypes<CTS extends LogType[] = never> = {
  debug: LogType;
  error: LogType;
  info: LogType;
  warn: LogType;
  log: LogType;
} & {
  [K in CTS[number]["name"]]: CTS[number];
};

export type FinalLogConfig<CTS extends LogType[] = never> = {
  ext?: "subLogger" | "powerLogger";
  type: keyof LogTypes<CTS>;
};

export type LogType = {
  name: string;
};

export type StandardPrefix = "mfgStamp" | "timestamp" | "module" | "namespace";

export type LoggerConfig = {
  prefix: {
    prefixOrder: StandardPrefix[];
    joinString: string;
    showTypes: boolean;
    newLine: boolean;
    padType: PadType;
    timestamp: {
      components: TimeStampComponents | TimeStampComponents[];
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module: {
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
      name: string;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace: {
      fn: Optional<(s: string) => string>; // The last function in the chain should return a string.
      color: PolymorphicColor;
      enabled: boolean;
      name: string;
    };
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp: {
      enabled: boolean;
    };
  };
  typeColors: Record<keyof LogTypes, PolymorphicColor>;
};

export type LoggerParams = Partial<{
  config?: LoggerParamsConfig;
}>;
