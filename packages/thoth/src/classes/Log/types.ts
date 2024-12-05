import { DOM } from "@classes/DOM/class.ts";
import { Log, RawLog, PowerLog, ThothLog } from "./index.ts";

export type LogVariantRegistry = {
  thothLog: ThothLog;
  powerLog: PowerLog;
  rawLog: RawLog;
};

export type VariantName = keyof LogVariantRegistry;

export type LogType = "log" | "warn" | "error" | "info" | "debug";
export type LogParams = {
  parent: Log | DOM;
  type?: LogType;
};

export type CreateChildOptions<T extends VariantName = "thothLog"> = {
  variant: T;
  logParams: LogParams;
};
