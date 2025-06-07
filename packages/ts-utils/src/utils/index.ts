import { deepmerge } from "deepmerge-ts";
import {
  Legacy_Recursive_Required,
  Recursive_OptionalFieldsOf,
  Recursive_Required,
  ErrorResponse,
} from "../types";

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

export function uniqueArrayMerge<T extends Array<any> = any[]>(
  target: any[],
  source: any[],
  options: any
): T {
  let values: any[] = [];

  for (let i = 0; i < target.length; i++) {
    if (!source.includes(target[i])) {
      values.push(target[i]);
    }
  }

  for (let i = 0; i < source.length; i++) {
    if (!target.includes(source[i])) {
      values.push(source[i]);
    }
  }

  return values as T;
}

export function preferentialArrayMerge<T extends Array<any> = any[]>(
  prefer: "target" | "source" = "target",
  unique: boolean = false
) {
  return (target: any[], source: any[], options: any): T => {
    let penultimate: any[] = [];
    findPenultimate: {
      if (!target.length && !source.length) {
        penultimate = target as T;
        break findPenultimate;
      }

      if (!target.length) {
        penultimate = source as T;
        break findPenultimate;
      }

      if (!source.length) {
        penultimate = target as T;
        break findPenultimate;
      }
      penultimate = prefer === "target" ? (target as T) : (source as T);
    }

    return (unique ? [...new Set(...penultimate)] : penultimate) as T;
  };
}
