// Types
import type { LineData } from "./types.ts";

// Classes
import { DOM } from "@classes/DOM/class.ts";

// Utils
import * as u from "@utils";
import chalk from "chalk";
import util from "util";

// Holds data about every line that needs to be rendered, and holds logic to render them all into the console.
export class Line {
  data: LineData;
  root: DOM;

  constructor(root: DOM, data: LineData) {
    this.root = root;
    this.data = data;
  }

  get mfgStamp(): boolean {
    return this.root.config.prefix.mfgStamp.enabled;
  }

  private joinData(...args: any[]) {
    return args.join(" ");
  }

  private joinComponents(components: Array<string | undefined | null>): string {
    return components.filter((c) => c).join("");
  }

  private getTypePrefix(type: LineData["type"]): string {
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

  render(): string {
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
      module,
      this.getTypePrefix(type),
      treePrefix,
      " ",
      this.joinData(data),
    );

    const line = this.joinComponents(components);
    return util.format(line);
  }
}
