import * as path from "path";
import * as fs from "fs";
import util from "util";

// Clear dev stream
fs.writeFileSync(
  path.resolve(process.cwd(), `./debug/log-dev.log`),
  "debug log - cleared on start\n\n",
);

const stream = fs.createWriteStream(
  path.resolve(process.cwd(), `./debug/log-${Date.now()}.log`),
  {
    flags: "a",
  },
);

const devStream = fs.createWriteStream(
  path.resolve(process.cwd(), `./debug/log-dev.log`),
  {
    flags: "a",
  },
);

const debugWriteStream = new console.Console(stream, stream);
const devWriteStream = new console.Console(devStream, devStream);

export function log(...args: any[]): void {
  const fmt = util.format(...args, "\n");
  // process.stdout.write(fmt);
  debugWriteStream.log(fmt);
  devWriteStream.log(fmt);
}