declare function runAsyncSynchronously<T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>, ...args: Args): T;

export { runAsyncSynchronously };
