"use strict";Object.defineProperty(exports, "__esModule", {value: true});function runAsyncSynchronously(asyncFunction, ...args) {
  const sharedBuffer = new SharedArrayBuffer(4);
  const lock = new Int32Array(sharedBuffer);
  let result;
  let error;
  asyncFunction(...args).then((res) => {
    result = res;
  }).catch((err) => {
    error = err;
  }).finally(() => {
    Atomics.store(lock, 0, 1);
    Atomics.notify(lock, 0, 1);
  });
  Atomics.wait(lock, 0, 0);
  if (error) {
    throw error;
  }
  return result;
}


exports.runAsyncSynchronously = runAsyncSynchronously;
