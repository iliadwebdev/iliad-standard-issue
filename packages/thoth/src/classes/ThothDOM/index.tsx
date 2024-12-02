import React, { useState } from "react";

// Ink
import { render, Box, Text } from "ink";
import type { Instance } from "ink";

// Utils
import patchConsole from "patch-console";
import isInCi from "is-in-ci";
import { uid } from "uid";
import util from "util";

import * as u from "@utils";

// Classes
import { Thoth } from "@classes/Thoth/index.ts";
import thoth from "@classes/Thoth/index.ts";

// State
import { useSignalEffect } from "@preact/signals-react";
import type { LogSignal } from "./types.ts";
import { logs, clearLogs, addToLogs } from "@state";

export class ThothDOM {
  // Must be asserted to allow singleton pattern
  private restore!: () => void;
  static domInstance: ThothDOM;
  private instance!: Instance;
  private thoth!: Thoth;

  constructor(thoth: Thoth) {
    if (ThothDOM.domInstance) {
      return ThothDOM.domInstance;
    } else {
      ThothDOM.domInstance = this;
    }

    this.thoth = thoth;
    this.instance = render(<App config={thoth?.config} />);

    this.patchConsole();
  }

  public unmount(): void {
    this.instance.unmount();
  }

  private writeToStdout(data: string): void {
    if (isInCi) {
      process.stdout.write(data);
      return;
    }

    this.rawLog(data);
  }

  private rawLog(data: string) {
    addToLogs({
      message: data,
      uid: uid(),
    });
  }

  private writeToStderr(data: string): void {
    if (isInCi) {
      process.stderr.write(data);
      return;
    }

    this.rawLog(data);
  }

  public clearLogs() {
    clearLogs();
  }

  private patchConsole() {
    this.restore = patchConsole((stream, data) => {
      data = `${data}`.replaceAll("\n", "");
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
}

const LogComponent = ({ uid, prefix, spinner, message }: LogSignal) => {
  const { timestamp, namespace, mfgStamp, module, type, depth } = prefix || {};
  const m = [message].flat();

  return (
    <Box gap={2}>
      <Box flexShrink={0} gap={1}>
        <Text>{mfgStamp}</Text>
        <Text>{timestamp}</Text>
        <Text>{namespace}</Text>
        <Text>{module}</Text>
        <Text>{type}</Text>
      </Box>
      <Box>
        <Text>{depth}</Text>
        {spinner}
        {m.map((msg, idx) => {
          return <Text key={`${uid}-${idx}`}>{util.format(msg)}</Text>;
        })}
      </Box>
    </Box>
  );
};

type AppProps = {
  config: Thoth["config"];
};
const App = ({ config }: AppProps) => {
  const [reactLogs, setReactLogs] = useState<LogSignal[]>([]);

  useSignalEffect(() => {
    setReactLogs(logs.value);
  });

  return (
    <Box flexDirection="column">
      {reactLogs.map((log) => {
        return <LogComponent key={log.uid} {...log} />;
      })}
    </Box>
  );
};

export default new ThothDOM(thoth);
