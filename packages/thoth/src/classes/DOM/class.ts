// Types
import type {
  CreateChildOptions,
  VariantName,
  LogParams,
} from "@classes/Log/types.ts";

// Classes
import { SpinnerManager } from "@classes/SpinnerManager/index.ts";
import { PowerLog, ThothLog, Log } from "@classes/Log/index.ts";
import { Line } from "@classes/Line/class.ts";
import LogStore from "@classes/LogStore.ts";

// Utils
import { createChildLog, createChildOptions } from "@classes/Log/utils.ts";
import { Configuration } from "@classes/Configuration/index.ts";
import patchConsole from "patch-console";

export class DOM {
  children: Array<ThothLog> = [];

  public readonly spinnerManager = SpinnerManager;
  public readonly config: Configuration;
  public readonly restore: () => void;
  public readonly parent = this;
  public readonly uid = "Root";
  public readonly root = this;
  public readonly depth = 0;

  private previousRenderedLines: string[] = [];
  private isCursorHidden: boolean = false;

  private renderLoopInterval: NodeJS.Timer | null = null;
  private framerate: number = 1000 / 60; // 60 FPS

  // Render state
  private renderRequested: boolean = false;
  private rendering: boolean = false;

  constructor(config: Configuration) {
    this.config = config;

    // Override console functionality
    this.restore = this.patchConsole();
    this.hideCursor();

    // Mount the DOM
    this.listenForEvents();
    this.commitExistingLogs();
    this.startRenderLoop();
  }

  public setFramerate(framesPerSecond: number) {
    this.framerate = 1000 / framesPerSecond;
  }

  /**
   * Recursively collect lines from all nodes in a stable order.
   */
  private collectLines(): Line[] {
    const lines: Line[] = [];

    // Recursive function to traverse the tree and collect lines
    const traverse = (node: DOM | Log) => {
      // If this is a Log (not the root DOM), add its own line
      if (node instanceof Log) {
        lines.push(
          new Line(this.root, {
            namespace: this.root.config.namespace,
            module: this.root.config.module,
            timestamp: `${node.timestamp}`,
            treePrefix: node.treePrefix,
            data: node.message,
            type: node.type,
            raw: node.raw,
          }),
        );
      }

      // Then traverse its children in order
      node.children.forEach((child) => {
        traverse(child);
      });
    };

    // Start traversal from each top-level child
    for (const child of this.children) {
      traverse(child);
    }

    return lines;
  }

  private renderIfNecessary() {
    if (this.renderRequested && !this.rendering) {
      this.rendering = true;
      setImmediate(() => {
        this.render();

        this.renderRequested = false;
        this.rendering = false;
      });
    }
  }

  private startRenderLoop() {
    this.renderLoopInterval = setInterval(() => {
      this.renderIfNecessary();
    }, this.framerate);
  }

  private stopRenderLoop() {
    if (this.renderLoopInterval) {
      clearInterval(this.renderLoopInterval[Symbol.toPrimitive]());
    }
  }

  /**
   * Render the entire tree by collecting lines in a stable, top-down order.
   */
  private render() {
    this.rendering = true;

    const linesToRender: Line[] = this.collectLines();

    const currentRenderedLines = linesToRender
      .map((line) => line.render())
      .join("\n")
      .split("\n");

    let buffer = "";
    buffer += "\x1B[H"; // Move cursor to home position

    currentRenderedLines.forEach((line, index) => {
      if (this.previousRenderedLines[index] !== line) {
        buffer += `\x1B[${index + 1};1H`; // Move cursor to line (1-based)
        buffer += "\x1B[2K"; // Clear the entire line
        buffer += line + "\n"; // Write the new line
      }
    });

    // Clear trailing lines if the new content is shorter
    if (currentRenderedLines.length < this.previousRenderedLines.length) {
      for (
        let i = currentRenderedLines.length;
        i < this.previousRenderedLines.length;
        i++
      ) {
        buffer += `\x1B[${i + 1};1H`;
        buffer += "\x1B[2K\n";
      }
    }

    this.previousRenderedLines = currentRenderedLines;

    // Write all updates at once
    process.stdout.write(buffer);

    // Move cursor below the last line
    buffer += `\x1B[${currentRenderedLines.length + 1};1H`;

    this.rendering = false;
  }

  public update() {
    this.renderRequested = true;
  }

  /**
   * Hide the cursor to prevent flickering during updates.
   */
  private hideCursor() {
    process.stdout.write("\x1B[?25l");
    this.isCursorHidden = true;
  }

  /**
   * Show the cursor again. Call this when exiting the application.
   */
  public showCursor() {
    if (this.isCursorHidden) {
      process.stdout.write("\x1B[?25h");
      this.isCursorHidden = false;
    }
  }

  private patchConsole() {
    return patchConsole((stream: any, data: any) => {
      if (data.endsWith("\n")) {
        data = data.slice(0, -1);
      }
      const method = this.config.overrideConsole ? "log" : "rawLog";

      if (stream === "stdout") {
        this[method]("debug", data);
      }
      if (stream === "stderr") {
        this[method]("error", data);
      }
    });
  }

  private commitExistingLogs() {
    // No-op in this example
  }

  // ======================
  // TREE TRAVERSAL METHODS
  // ======================
  get recursiveChildren(): LogStore {
    const children = this.children.flatMap((child) => {
      return child.recursiveChildren;
    });

    return new LogStore(this, children);
  }

  private addChild<T extends Log>(child: T): T {
    this.children.push(child);
    this.update(); // Re-render the tree
    return child;
  }

  public getChildrenOfDepth(depth: number): LogStore {
    const absChildren = this.recursiveChildren.filter((child) => {
      return child.depth === depth;
    });

    return new LogStore(this, absChildren);
  }

  public getArbitraryChild(index: number): ThothLog | undefined {
    return this.children[index];
  }

  // =================
  // LIFECYCLE METHODS
  // =================
  private unmount(err?: Error) {
    const showCursor = () => this.showCursor();
    showCursor();

    this.stopRenderLoop();
    this.restore();

    if (err) console.error(err);
    process.exit(1);
  }

  private listenForEvents() {
    const showCursor = () => this.showCursor();
    process.on("exit", showCursor);
    process.on("SIGINT", () => {
      this.unmount();
    });
    process.on("uncaughtException", (err) => {
      this.unmount(err);
    });
    process.stdout.on("resize", () => {
      this.update();
    });
  }

  // ===============
  // API FOR LOGGING
  // ===============
  get logParams(): LogParams {
    return {
      parent: this,
    };
  }

  public createChild<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = "",
  ) {
    const child = createChildLog(this, options, arguments_);
    this.addChild(child);
    return child;
  }

  private rawLog(type: "debug" | "error" = "debug", data: any) {
    const options = createChildOptions("rawLog", {
      parent: this,
      type: type,
    });

    const log = createChildLog(this, options, data);
    return this.addChild(log);
  }

  public log(...args: any[]) {
    const options = createChildOptions("thothLog", {
      parent: this,
      type: "log",
    });

    const log = createChildLog(this, options, args);
    return this.addChild(log);
  }

  public _log(...args: any[]) {
    return this.log(...args);
  }

  public $log(message: string = ""): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "log",
    });

    const log = createChildLog(this, options, message);
    return this.addChild(log);
  }

  public _$log(message: string = "") {
    return this.$log(message);
  }
}
