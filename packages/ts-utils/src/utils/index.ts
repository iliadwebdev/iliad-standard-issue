import { deepmerge } from "deepmerge-ts";
import deasync from "deasync";

export * from "./typeguards"; // Type guard functions

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
type RRU<T> = Recursive_Required<T> | Legacy_Recursive_Required<T>;
export function mergeDefaults<
  T,
  RR extends RRU<T> = Legacy_Recursive_Required<T>
>(obj: T | undefined, defaults: Recursive_OptionalFieldsOf<T>): RR {
  return deepmerge(defaults, obj || {}) as RR;
}

type UnionWithoutUndefined<T> = T extends undefined ? never : T;

export function isError<T extends object>(
  error: ErrorResponse["error"] | undefined,
  data: Partial<T> = {}
): data is UnionWithoutUndefined<T> {
  return !!error;
}
