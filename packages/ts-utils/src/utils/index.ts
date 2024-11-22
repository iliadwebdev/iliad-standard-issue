export function runAsyncSynchronously<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  ...args: Args
): T {
  const sharedBuffer = new SharedArrayBuffer(4);
  const lock = new Int32Array(sharedBuffer);

  let result: T | undefined;
  let error: any;

  asyncFunction(...args)
    .then((res) => {
      result = res;
    })
    .catch((err) => {
      error = err;
    })
    .finally(() => {
      Atomics.store(lock, 0, 1); // Set lock to indicate completion
      Atomics.notify(lock, 0, 1); // Wake up the waiting thread
    });

  // Block synchronously until the async operation completes
  Atomics.wait(lock, 0, 0);

  // Rethrow any error from the async function
  if (error) {
    throw error;
  }

  // TypeScript ensures that `result` must be of type `T`
  return result as T;
}
