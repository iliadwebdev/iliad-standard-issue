export * from "./utils.ts";
import util from "util";

export function _<T extends object[]>(...u: T): T[number] {
  let _u = {} as T[number]; // Ensure _u is typed as the combined type of all input objects

  for (let i = 0; i < u.length; i++) {
    _u = { ..._u, ...u[i] };
  }

  return _u;
}

export function log(...args: any[]): void {
  process.stdout.write(util.format(...args, "\n"));
}
