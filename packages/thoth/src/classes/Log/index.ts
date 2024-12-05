// Types
import type {
  LogVariantRegistry,
  CreateChildOptions,
  VariantName,
  LogParams,
  LogType,
} from "./types.ts";

// Classes
import { Line } from "@classes/Line/class.ts";
import { DOM } from "@classes/DOM/class.ts";
import LogStore from "@classes/LogStore.ts";

// Utils
import { createChildLog, createChildOptions } from "./utils.ts";
import * as $R from "remeda";
import chalk from "chalk";
import { uid } from "uid";
import util from "util";

// Data
import { LINES } from "./data.ts";

export class Log {
  // ADDED: Track the child's position under its parent
  public childIndex: number = 0; // will be set by parent when added

  children: LogStore = new LogStore(this);
  public readonly uid: string;
  readonly parent: Log | DOM;
  depth: number;
  root: DOM;

  timestamp: number = Date.now();
  type: LogType = "log";
  message: string = "";
  arguments_: any[];

  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    this.parent = options.parent;
    this.arguments_ = arguments_;
    this.root = this.parent.root;
    this.depth = this.parent.depth + 1;

    this.message = util.format(...arguments_);
    options.type && (this.type = options.type);
    this.uid = `${this.constructor.name}-${uid()}`;
  }

  protected get siblings(): LogStore {
    const siblings = this.parent?.children.filter((child) => child !== this);
    return new LogStore(this, siblings);
  }

  protected get absoluteSiblings(): LogStore {
    return this.root.getChildrenOfDepth(this.depth);
  }

  protected getSiblingsBefore(): LogStore {
    return this.siblings.beforeOwner;
  }

  protected getSiblingsAfter(): LogStore {
    return this.siblings.afterOwner;
  }

  // CHANGED: Use childIndex to determine if this is the last child.
  protected get isLastChild(): boolean {
    if (this.parent instanceof DOM) return false;
    return $R.last(this.parent.children) === this;
  }

  get recursiveChildren(): LogStore {
    const children = this.children.flatMap((child) => {
      return [child, ...child.recursiveChildren];
    });

    return new LogStore(this, children);
  }

  getTreePrefix(): string {
    if (this.parent instanceof DOM) return "";
    const chunks: string[] = [];

    chunks.push(this.isLastChild ? LINES.LAST_CHILD : LINES.CHILD);

    let current = this.parent;
    while (current && !(current.parent instanceof DOM)) {
      chunks.unshift(current.isLastChild ? LINES.EMPTY : LINES.DIRECTORY);
      current = current.parent;
    }

    return " " + chunks.join("");
  }

  get treePrefix(): string {
    return this.getTreePrefix();
  }

  get raw(): boolean {
    return false;
  }

  getLine(): Line {
    return new Line(this.root, {
      namespace: this.root.config.namespace,
      module: this.root.config.module,
      timestamp: `${this.timestamp}`,
      treePrefix: this.treePrefix,
      data: this.message,
      type: this.type,
      raw: this.raw,
    });
  }

  getLines(): Line[] {
    const lines: Line[] = [];

    lines.push(
      new Line(this.root, {
        namespace: this.root.config.namespace,
        module: this.root.config.module,
        timestamp: `${this.timestamp}`,
        treePrefix: this.treePrefix,
        data: this.message,
        type: this.type,
        raw: this.raw,
      }),
    );

    if (this.hasChildren) {
      this.children.forEach((child, index) => {
        lines.push(...child.getLines());
      });
    }

    return lines;
  }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  protected createSibling<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = "",
  ): LogVariantRegistry[T] {
    if (this.parent instanceof DOM) {
      return this.parent.createChild(
        options,
        arguments_,
      ) as LogVariantRegistry[T];
    }
    return this.parent.createChild(options, arguments_);
  }

  // CHANGED: After adding a child, set the child's childIndex.
  protected addChild(child: Log) {
    this.children.push(child);
    this.root.update();
    return child;
  }

  protected createChild<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = "",
  ): LogVariantRegistry[T] {
    const child = createChildLog(this, options, arguments_);
    this.addChild(child);
    return child;
  }

  public log(...args: any[]): ThothLog {
    const options = createChildOptions("thothLog", {
      parent: this,
      type: "log",
    });

    return this.createSibling(options, args);
  }

  public _log(message: string): ThothLog {
    const options = createChildOptions("thothLog", {
      parent: this,
      type: "log",
    });

    return this.createChild(options, message);
  }

  public $log(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "log",
    });

    return this.createSibling(options, message);
  }

  public _$log(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "log",
    });

    return this.createChild(options, message);
  }
}

export class ThothLog extends Log {
  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
  }
}

export class RawLog extends ThothLog {
  parent: DOM;

  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
    this.parent = options.parent.root;
  }

  get raw(): boolean {
    return true;
  }

  get treePrefix(): string {
    return "";
  }
}

export class PowerLog extends ThothLog {
  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
  }

  advanceFrame() {
    // no-op here
  }
}
