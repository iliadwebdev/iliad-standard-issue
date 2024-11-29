import { TimeStampComponents, PolymorphicColor, PadType } from "@types";
import { StandardPrefix, LoggerParams, LogType } from "@classes/Logger/types";

export type ThothParams = LoggerParams & {
  customTypes?: LogType[];
};

export type LoggerParamsConfig = {
  prefix?: {
    prefixOrder?: StandardPrefix[];
    joinString?: string;
    showTypes?: boolean;
    padType?: PadType;
    newLine?: boolean;
    timestamp: {
      components?: TimeStampComponents | TimeStampComponents[];
      color?: PolymorphicColor;
      fn?: (s: string) => string; // The last function in the chain should return a string.
      enabled: boolean;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    module?: {
      fn?: (s: string) => string; // The last function in the chain should return a string.
      color?: PolymorphicColor;
      enabled: boolean;
      name?: string;
    };
    // Whether or not to show the namespace (e.g. Iliad, Thoth, Atlas, Gcollective, etc.)
    namespace?: {
      fn?: (s: string) => string; // The last function in the chain should return a string.
      color?: PolymorphicColor;
      enabled: boolean;
      name?: string;
    };
    // Whether or not to show the manufacturer stamp (Iliad)
    mfgStamp?: {
      enabled?: boolean;
    };
  };
};
