import { IUtils } from './internalUtils.js';

// === Utility Types ===
// Utility types are a way to create new types by transforming or combining other types. 🧠
// =====================



declare global {
  export type MonthLong = "january" | "february" | "march" | "april" | "may" | "june" | "july" | "august" | "september" | "october" | "november" | "december";

  export type MonthShort = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

  export type Month = MonthLong | MonthShort;

  export type Year = number;

  // LOGICAL UTILITY TYPES
  // =====================
  export type Without<T, U> = {
      [P in Exclude<keyof T, keyof U>]?: never;
  };

  export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

  export type OR<T, U> = T | U;

  // DATA PROCESSING UTILITY TYPES
  // =============================
  type NetworkError = {
      message: string;
      code: number;
  };

  // Error response is useful for handling guaranteed error responses.
  export type ErrorResponse<E = {
      message: string;
      code: number;
  }> = {
      data?: undefined;
      error: E;
  };

  export type StandardResponse<T, E = NetworkError> = XOR<{
      data: T;
      error?: undefined;
  }, ErrorResponse<E>>;

  // TYPE DECLARATION UTILITIES
  // ==========================
  export type FalsyPart<T> = Extract<T, IUtils.Falsy>; // Returns the falsy part of a type


  export type NotFalsy<T> = Exclude<T, IUtils.Falsy>; // Returns the non-falsy part of a type


  export type Falsable<T> = T | false; // Makes a type falsable


  export type Nullable<T> = T | null; // Makes a type nullable


  export type PickOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>; // Copy a type and make some fields optional


  export type Optional<T> = undefined | T; // Makes a type explicitely optional


  // Recursive_Required<T> recursively makes all fields of T required. Useful for taking params that were optional and making a type that has been populated with default values.
  export type Recursive_Required<T> = {
      [K in keyof T]-?: IUtils.RecursiveRequiredHelper<T[K]>;
  };

  // Where did things go wrong?
  export type Legacy_Recursive_Required<T> = {
      [K in keyof T]-?: NonNullable<T[K]> extends object ? Legacy_Recursive_Required<NonNullable<T[K]>> : NonNullable<T[K]>;
  };

  // Semantic alias of Recursive_OptionalFieldsOf<T>
  export type DefaultParams<T> = Recursive_OptionalFieldsOf<T>;

  // OptionalFieldsOf<T> picks all optional fields of T and makes them required. Very useful for making a type that represents the default values for something that aren't already required.
  export type OptionalFieldsOf<T> = {
      [K in IUtils.OptionalKeys<T>]-?: T[K];
  };

  // Recursive_OptionalFieldsOf<T> recursively picks optional fields and makes them required.
  export type Recursive_OptionalFieldsOf<T> = T extends object ? {
      [K in IUtils.OptionalKeys<T>]-?: Recursive_OptionalFieldsOf<T[K]>;
  } : T;

  // GENERATOR UTILITIES
  // ===================
  // @ts-ignore
  export type BinaryPermutations<N extends number> = N extends 0 ? "" : PrependBit<BinaryPermutations<Decrement<N>>>;

  export type NumericalRange<F extends number, T extends number> = IntRange<F, T>;

  export type IntRange<F extends number, T extends number> = Exclude<IUtils.Enumerate<T>, IUtils.Enumerate<F>>;

}
