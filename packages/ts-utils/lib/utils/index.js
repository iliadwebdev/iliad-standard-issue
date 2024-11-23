import { deepmerge } from "deepmerge-ts";
import deasync from "deasync";
function mergeDefaults(obj, defaults) {
  return deepmerge(defaults, obj || {});
}
const defaultSyncOptions = {
  throwOnError: false,
  timeout: 0
};
function sync(fn, options) {
  return function(...args) {
    const { throwOnError, timeout } = mergeDefaults(
      options,
      defaultSyncOptions
    );
    var done = false;
    var result = void 0;
    var error = void 0;
    function setDone(id) {
      console.log(id);
      if (!done) done = true;
    }
    var timeoutId = void 0;
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        console.log("timeout concluded, done is ", done);
        if (!done) {
          error = "Synchronous function timed out.";
          setDone("timeout body");
        }
      }, timeout);
    }
    console.log(
      "at this point, done is ",
      done,
      "and timeoutId is ",
      timeoutId
    );
    try {
      const promise = fn(...args);
      promise.then((res) => {
        console.log("resolution of promise");
        if (!done) {
          clearTimeout(timeoutId);
          result = res;
          setDone("promise.then callback body");
        }
      }).catch((err) => {
        clearTimeout(timeoutId);
        if (!done) {
          error = err;
          setDone("promise.catch callback body");
        }
      }).finally(() => {
        clearTimeout(timeoutId);
        if (!done) {
          setDone("promise.finally callback body");
        }
      });
    } catch (err) {
      if (!done) {
        error = err;
        setDone("try{} catch  body");
      }
    } finally {
      clearTimeout(timeoutId);
      if (!done) {
        setDone("try{} finally body");
      }
    }
    deasync.loopWhile(() => {
      console.log("done is ", done);
      return !done;
    });
    clearTimeout(timeoutId);
    if (error) {
      if (throwOnError) throw error;
      return { error };
    } else if (result !== void 0) {
      return { data: result };
    } else {
      const unknownError = "Unknown error occurred.";
      if (throwOnError) throw new Error(unknownError);
      return {
        error: {
          message: unknownError,
          code: 500
        }
      };
    }
  };
}
export {
  mergeDefaults,
  sync
};
