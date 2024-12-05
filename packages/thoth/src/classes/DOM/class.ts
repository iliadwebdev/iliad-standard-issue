// Types
import type {
  CreateChildOptions,
  VariantName,
  LogParams,
} from "@classes/Log/types.ts";

// Classes
import { SpinnerManager } from "@classes/SpinnerManager/index.ts";
import { PowerLog, ThothLog, Log } from "@classes/Log/index.ts";
import { LogData } from "@classes/LogData/class.ts";
import AverageArray from "@classes/AverageArray.ts";
import LogStore from "@classes/LogStore.ts";

// Data
import { domConfig } from "./data.ts";

// Utils
import { createChildLog, createChildOptions } from "@classes/Log/utils.ts";
import { Configuration } from "@classes/Configuration/index.ts";
import patchConsole from "patch-console";
import * as utils from "@utils";
import * as $R from "remeda";

function renderLog(fr: number, times: AverageArray) {
  utils.log(
    `==============================================\nNEW RENDER FRAME - Frame: ${fr + 1} (avg time: ${times.average()}ms)\n==============================================`,
  );
}

export class DOM {
  children: Array<ThothLog> = [];

  // Metrics
  private renderTimes = new AverageArray(domConfig.RENDER_AVG_SAMPLE_SIZE);
  private framesRendered: number = 0;

  public readonly spinnerManager = SpinnerManager;
  public readonly uid = domConfig.STATIC_UID;
  public readonly config: Configuration;
  public readonly restore: () => void;
  public readonly parent = this;
  public readonly root = this;
  public readonly depth = 0;

  private isCursorHidden: boolean = false;
  private previousLineIndex: number = 0; // Represents the last line index of the previous render

  private renderLoopInterval: NodeJS.Timer | null = null;
  private framerate: number = 1000 / domConfig.FRAME_RATE; // 60 FPS

  // Render state
  private fullRenderRequested: boolean = false;
  private renderRequested: boolean = false;
  private rendering: boolean = false;

  constructor(config: Configuration) {
    this.config = config;

    // Override console functionality
    this.restore = this.patchConsole();
    this.hardClearConsole();
    this.hideCursor();

    // Mount the DOM
    this.listenForEvents();
    this.startRenderLoop();
  }

  public setFramerate(framesPerSecond: number) {
    this.framerate = 1000 / framesPerSecond;
  }

  private renderIfNecessary() {
    if (this.renderRequested && !this.rendering) {
      this.rendering = true;
      setImmediate(() => {
        this.render();
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

  // ILIAD: TODO: I need to formalize the naming of these methods
  // inform of update request update update required update request it is gay!
  private fullRerender() {
    for (const child of this.children) {
      child.informOfUpdate();
    }
    this.informOfUpdate(true);
  }

  private hardClearConsole() {
    process.stdout.write("\x1Bc");
  }

  /**
   * Recursively collect lines from all nodes in a stable order.
   */
  private collectLogData(): LogData[] {
    const lines: LogData[] = [];

    // Recursive function to traverse the tree and collect lines
    const traverse = (node: DOM | Log) => {
      // If this is a Log (not the root DOM), add its own line
      if (node instanceof Log) {
        lines.push(node.data);
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

  getTerminalWidth(): number {
    return process.stdout.columns || 80;
  }

  getTerminalHeight(): number {
    return process.stdout.rows - 1 || 24;
  }

  getTerminalSize(): { width: number; height: number } {
    return {
      height: this.getTerminalHeight(),
      width: this.getTerminalWidth(),
    };
  }

  get totalLinesConsumed(): number {
    return this.collectLogData().reduce((acc, log) => {
      return acc + log.linesConsumed;
    }, 0);
  }

  get deadSpace(): number {
    return Math.max(this.getTerminalHeight() - this.totalLinesConsumed, 0);
  }

  /**
   * Render the entire tree by collecting data in a stable, top-down order.
   */
  private render() {
    this.rendering = true;

    const full = this.fullRenderRequested;

    // Metrics
    const renderStartTime = performance.now();
    renderLog(this.framesRendered, this.renderTimes);

    // This holds the calculated data for each log node
    const dataToRender: LogData[] = this.collectLogData();

    // Prepare the buffer. If a full render is requested, clear the console entirely.
    if (full) this.hardClearConsole();
    let buffer = "";
    buffer += "\x1B[H"; // Move cursor to home position

    let lineIndex = 1; // 1-based index

    dataToRender.forEach((data) => {
      const linesConsumed = data.linesConsumed;

      // Skip rendering if the data is unchanged
      rendering: {
        if (!data.log.renderRequested) break rendering; // Skip rendering if not requested - meaning the data is unchanged

        // This is where we actually render each log.
        // This method avoids flickering by only updating the lines that have changed.
        buffer += `\x1B[${lineIndex};1H`; // Move cursor to line (1-based)
        buffer += "\x1B[2K"; // Clear the entire line
        buffer +=
          data.toString() +
          ` (c:${linesConsumed}, i:${lineIndex}, h:${this.getTerminalHeight()}, full: ${full})` +
          "\n"; // Write the new line

        // Inform the log that it has been rendered - probably a better way to this.
        // Benchmarking will be necessary.
        data.log.informOfRerender();
      }

      // We need to keep track of the actual number of lines consumed, not just the number of logs.
      // Each log can consume multiple lines.
      lineIndex += linesConsumed;
    });

    // Clear trailing lines if the new content is shorter
    // Unsure if this needs to be adjusted on full render
    for (let i = lineIndex; i < this.previousLineIndex; i++) {
      buffer += `\x1B[${i + 1};1H\x1B[2K`;
    }

    // Store the last line index for the next render
    this.previousLineIndex = lineIndex;

    // Write all updates at once
    process.stdout.write(buffer);

    // Move cursor below the last line
    buffer += `\x1B[${lineIndex + 1};1H`;

    // Metrics
    this.renderTimes.push(performance.now() - renderStartTime);
    this.framesRendered++;

    // Reset render flags
    full && (this.fullRenderRequested = false);
    this.renderRequested = false;
    this.rendering = false;
  }

  public informOfUpdate(full: boolean = false) {
    full && (this.fullRenderRequested = true);
    this.renderRequested = true;
  }

  public requestRender = this.informOfUpdate;
  public requestFullRender = this.fullRerender;

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
      if (data.endsWith("\n")) data = data.slice(0, -1);

      const method = this.config.overrideConsole ? "log" : "rawLog";

      if (stream === "stdout") {
        this[method]("debug", data);
      }
      if (stream === "stderr") {
        this[method]("error", data);
      }
    });
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
    this.informOfUpdate(); // Re-render the tree
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

  private handleResize(): void {
    // this may need debouncing
    this.requestFullRender();
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
      this.handleResize();
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
