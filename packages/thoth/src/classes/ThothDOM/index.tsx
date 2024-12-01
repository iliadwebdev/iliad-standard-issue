import React from "react";

// Ink
import { Instance, Text, Box, render } from "ink";

// Classes / Components
import { BasicLog } from "@classes/ThothLog/components/BasicLog.tsx";
import { ThothLog } from "@classes/ThothLog/index.tsx";
import { Thoth } from "@classes/Thoth/index.ts";

// Utils
import patchConsole from "patch-console";
import isInCi from "is-in-ci";

type Restore = () => void;
export class ThothDOM {
  static domInstance: ThothDOM;

  private loggerMap: Map<string, ThothLog> = new Map();
  private instance!: Instance;
  private restore!: Restore;
  private thoth!: Thoth;

  constructor(thoth: Thoth) {
    if (ThothDOM.domInstance) {
      return ThothDOM.domInstance;
    }
    ThothDOM.domInstance = this;

    this.thoth = thoth;
    this.instance = this.render();

    this.patchConsole();
  }

  render() {
    // console.log("rendering");
    const components = Array.from(this.loggerMap.values())
      .map(({ component }) => component)
      .filter(Boolean);

    if (this.instance) {
      this.instance.rerender(<Box flexDirection="column">{components}</Box>);
      return this.instance;
    }

    return render(<Box>{components}</Box>, {
      patchConsole: true,
    });
  }

  registerLogger(logger: ThothLog) {
    this.loggerMap.set(logger.uid, logger);
    this.refresh();
  }

  private writeToStderr(data: string): void {
    if (isInCi) {
      process.stderr.write(data);
      return;
    }

    this.instance.clear();
    this.thoth.error(data);
    // this.refresh();
  }

  private writeToStdout(data: string): void {
    if (isInCi) {
      process.stdout.write(data);
      return;
    }

    this.instance.clear();
    this.thoth.debug(data);
    // this.refresh();
  }

  private patchConsole() {
    this.restore = patchConsole((stream, data) => {
      data = ` ${data}`;
      if (stream === "stdout") {
        this.writeToStdout(data);
      }

      if (stream === "stderr") {
        const isReactMessage = data.startsWith("The above error occurred");

        if (!isReactMessage) {
          this.writeToStderr(data);
        }
      }
    });
  }

  updateLogger(logger: ThothLog) {
    if (this.loggerMap.has(logger.uid)) {
      this.loggerMap.set(logger.uid, logger);
      this.refresh();
    }
  }

  refresh() {
    this.render();
  }
}
