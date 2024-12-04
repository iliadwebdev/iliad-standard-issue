import React, { useState } from "react";

// Ink
import { render, Box, Text } from "ink";
import type { Instance } from "ink";

// Utils
import patchConsole from "patch-console";
// import patchConsole from "@utils/patch-console.ts";
import isInCi from "is-in-ci";
import { uid } from "uid";
import util from "util";

// Classes
import { Thoth } from "@classes/Thoth/server.ts";

// State
import { useSignalEffect } from "@preact/signals-react";
import { logs, clearLogs, addToLogs } from "@state";
import type { LogSignal } from "./types.ts";

type Restore = () => void;
export class ThothDOM {
  // Must be asserted to allow singleton pattern
  static domInstance: ThothDOM;
  private instance!: Instance;
  private restore!: Restore;
  private thoth!: Thoth;

  constructor(thoth: Thoth) {
    if (ThothDOM.domInstance) {
      return ThothDOM.domInstance;
    } else {
      ThothDOM.domInstance = this;
    }

    this.thoth = thoth;
    [this.instance, this.restore] = this.mount();
  }

  // I'm writing this drunk, no idea what is going on here.
  public unmount(): void {
    this.instance.unmount();
    this.restore();

    // Restore doesn't seem to actually restore the console, so we'll do it manually
    const _console = new console.Console(process.stdout, process.stderr);
    for (const method in _console) {
      // @ts-ignore
      console[method] = _console[method];
    }
  }

  public mount(): [Instance, Restore] {
    const instance = render(<App config={this.thoth?.config} />);
    const restore = this.patchConsole();

    return [instance, restore];
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
    return patchConsole((stream, data) => {
      data = `${data}`.replaceAll("\n", "").trim();
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

  const space = prefix ? <Text>{"  "}</Text> : undefined;

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
        {spinner ?? space}
        {m.map((msg, idx) => {
          return <Text key={`${uid}-${idx}`}>{util.format(msg)}</Text>;
        })}
      </Box>
    </Box>
  );
};

const ConciseLogComponent = ({ uid, prefix, spinner, message }: LogSignal) => {
  const { timestamp, namespace, mfgStamp, module, type, depth } = prefix || {};
  const m = [message].flat();

  const space = prefix ? <Text> </Text> : undefined;

  return (
    <Box>
      <Box flexShrink={0}>
        <Text>{mfgStamp}</Text>
        <Text>{timestamp}</Text>
        <Text>{namespace}</Text>
        <Text>{module}</Text>
        <Text>{type}</Text>
      </Box>
      <Box>
        <Text>{depth}</Text>
        {spinner ?? space}
        {m.map((msg, idx) => (
          <Text key={`${uid}-${idx}`}>{util.format(msg)}</Text>
        ))}
      </Box>
    </Box>
  );
};

const DeepLogComponent = ({ uid, prefix, spinner, message }: LogSignal) => {
  const { timestamp, namespace, mfgStamp, module, type, depth } = prefix || {};
  const m = [message].flat();

  const prefixes = [mfgStamp, timestamp, namespace, module, type, depth]
    .filter(Boolean)
    .map((p) => <Text>{p}</Text>);

  return (
    <Box>
      {/* {prefixes} {spinner ?  : <Text> </Text>} */}
      {m.map((msg, idx) => (
        <Text key={`${uid}-${idx}`}>{util.format(msg)}</Text>
      ))}
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
        return <ConciseLogComponent key={log.uid} {...log} />;
      })}
    </Box>
  );
};
