// import { signal, Signal } from "@preact/signals-react";
// import type { LogSignal } from "./types.ts";

// // Thoth Utils
// import * as u0 from "@utils";
// const u = { ...u0 };

// export const logs: Signal<LogSignal[]> = signal([]);

// export function addToLogs(log: LogSignal) {
//   logs.value = [...logs.value, log];
// }

// export function clearLogs() {
//   logs.value = [];
// }

// function merge(log: LogSignal, newLogData: Partial<LogSignal>) {
//   return {
//     ...log,
//     ...newLogData,
//     prefix: {
//       ...log.prefix,
//       ...newLogData.prefix,
//     },
//   };
// }

// export function updateLog(uid: string, newLogData: Partial<LogSignal>) {
//   logs.value = logs.value.map((log) => {
//     if (log.uid !== uid) return log;
//     return merge(log, newLogData);
//   });
// }
