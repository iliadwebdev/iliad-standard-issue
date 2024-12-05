// Types
import type { LogDataInput } from "./types.ts";

// Classes
import { DOM } from "@classes/DOM/class.ts";
import { Log } from "@classes/Log/index.ts";

// Utils
import wrapAnsi from "wrap-ansi";
import * as u from "@utils";
import chalk from "chalk";
import util from "util";

// Data
import { wrapAnsiConfig } from "./data.ts";

// Holds data for each log node in the tree
// And holds the rendering logic for each log node
export class LogData {
  data: LogDataInput;
  root: DOM;
  log: Log; // The associated log node

  constructor(root: DOM, log: Log, data: LogDataInput) {
    this.root = root;
    this.data = data;
    this.log = log;
  }

  get mfgStamp(): boolean {
    return this.root.config.prefix.mfgStamp.enabled;
  }

  private joinData(...args: any[]): string {
    // return util.format(...args);
    // return args.map((arg) => util.format(arg)).join(" ");
    return args.join("");
  }

  private joinComponents(components: Array<string | undefined | null>): string {
    return components.filter((c) => c).join("");
  }

  private getTypePrefix(type: LogDataInput["type"]): string {
    const fn = this.root.config.typeColors[type];
    return fn(
      "[" +
        {
          info: "INF",
          log: "LOG",
          warn: "WRN",
          error: "ERR",
          debug: "DBG",
        }[type] +
        "]",
    );
  }

  private getDateString(timestamp: number): string {
    const { components, color, fn } = this.root.config.prefix.timestamp;
    const stampString = u.getTimestamp(components, timestamp);

    return fn(color(stampString));
  }

  get linesConsumed(): number {
    // No silly algorithm now. We just rely on ansiWrap to tell us how many lines were consumed.
    return this.toString().split("\n").length;
  }

  get terminalWidth(): number {
    return this.root.getTerminalWidth();
  }

  get terminalHeight(): number {
    return this.root.getTerminalHeight();
  }

  toString(): string {
    const components: Array<string | undefined | null> = [];
    const { treePrefix, namespace, module, type, data, raw, timestamp } =
      this.data;

    if (raw) {
      const line = this.joinData(data);
      return util.format(line);
    }

    if (this.mfgStamp) {
      components.push(chalk.hex("#00ace0")("◭"), " ");
    }

    if (timestamp && !isNaN(Number(timestamp))) {
      components.push(this.getDateString(Number(timestamp)));
    }

    components.push(
      namespace,
      // module,
      `(${chalk.magentaBright(this.log.uid)}) `,
      this.getTypePrefix(type),
      treePrefix,
      " ",
      this.joinData(data),
    );

    const line = this.joinComponents(components); // Assemble components into a single string
    const nodeFormatted = util.format(line); // Format the string with util.format. Not certain if this changes anything.

    // Wrap with ansi-wrap. This is a more predictable way to wrap than trying to derive from the terminal width.
    const ansiWrapped = wrapAnsi(
      nodeFormatted,
      this.terminalWidth,
      wrapAnsiConfig,
    );

    u.log({ ansiWrapped });

    return ansiWrapped;
  }
}
