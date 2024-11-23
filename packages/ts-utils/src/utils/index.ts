import { deepmerge } from "deepmerge-ts";
import deasync from "deasync";

/**
 * Merges the provided object with the default values, ensuring that all fields
 * from the defaults are present in the resulting object.
 * Tip: If you want the resultant object to maintain optional fields, explicitely type the input type as `| undefined`.
 *
 * @template T - The type of the object to merge.
 * @param {T} obj - The object to merge with the defaults.
 * @param {Recursive_OptionalFieldsOf<T>} defaults - The default values to merge into the object.
 * @returns {Recursive_Required<T>} - The resulting object with all default fields included.
 */

export function mergeDefaults<T>(
  obj: T | undefined,
  defaults: Recursive_OptionalFieldsOf<T>
): Recursive_Required<T> {
  return deepmerge(defaults, obj || {}) as Recursive_Required<T>;
}

const defaultSyncOptions: DefaultParams<SyncOptions> = {
  throwOnError: false,
  timeout: 0,
};

type SyncOptions = {
  throwOnError?: boolean;
  timeout?: number;
};
export function sync<Args extends any[], R>(
  fn: (...args: Args) => Promise<R>,
  options?: SyncOptions
): (...args: Args) => StandardResponse<R> {
  return function (...args: Args): StandardResponse<R> {
    const { throwOnError, timeout } = mergeDefaults<SyncOptions>(
      options,
      defaultSyncOptions
    );

    var done = false;
    var result: R | undefined = undefined;
    var error: any = undefined;

    function setDone(id: any): void {
      console.log(id);
      if (!done) done = true;
    }

    var timeoutId: NodeJS.Timeout | undefined = undefined;

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
      promise
        .then((res) => {
          console.log("resolution of promise");
          if (!done) {
            clearTimeout(timeoutId);
            result = res;
            setDone("promise.then callback body");
          }
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          if (!done) {
            error = err;
            // done = true;
            setDone("promise.catch callback body");
          }
        })
        .finally(() => {
          clearTimeout(timeoutId);
          if (!done) {
            // done = true;
            setDone("promise.finally callback body");
          }
        });
    } catch (err) {
      if (!done) {
        error = err;
        setDone("try{} catch  body");

        // done = true;
      }
    } finally {
      clearTimeout(timeoutId);
      if (!done) {
        setDone("try{} finally body");
        // done = true;
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
    } else if (result !== undefined) {
      return { data: result };
    } else {
      const unknownError = "Unknown error occurred.";
      if (throwOnError) throw new Error(unknownError);
      return {
        error: {
          message: unknownError,
          code: 500,
        },
      };
    }
  };
}
