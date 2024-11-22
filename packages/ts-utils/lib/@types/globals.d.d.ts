declare global {
  export type MonthLong =
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december";

  export type MonthShort =
    | "jan"
    | "feb"
    | "mar"
    | "apr"
    | "may"
    | "jun"
    | "jul"
    | "aug"
    | "sep"
    | "oct"
    | "nov"
    | "dec";

  export type Month = MonthLong | MonthShort;

  export type Year = number;

  type Enumerate<
    N extends number,
    Acc extends number[] = []
  > = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

  export type IntRange<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
  >;

  export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  export type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

  export type OR<T, U> = T | U;

  export type NetworkResponse<T> =
    | {
        data: T;
        error: undefined;
      }
    | {
        data: undefined;
        error: {
          message: string;
          code: number;
        };
      };

  export type StandardResponse<T> = NetworkResponse<T>;

  export type Falsy = false | 0 | "" | null | undefined;

  export type FalsyPart<T> = Extract<T, Falsy>;

  export type NotFalsy<T> = Exclude<T, Falsy>;

  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  export type Nullable<T> = T | null;

  export type NumericalRange<F extends number, T extends number> = IntRange<F, T>;

  // Helper type to build an array of a given length
  type BuildArray<
    Length extends number,
    Accumulator extends unknown[] = []
  > = Accumulator["length"] extends Length
    ? Accumulator
    : BuildArray<Length, [...Accumulator, unknown]>;

  // Helper type to decrement a number
  type Decrement<N extends number> = BuildArray<N> extends [
    infer _,
    ...infer Rest
  ]
    ? Rest["length"]
    : never;

  // Type to prepend '0' and '1' to each string in a union
  type PrependBit<T extends string> = T extends string
    ? `0${T}` | `1${T}`
    : never;

  export type BinaryPermutations<N extends number> = N extends 0
    ? ""
    : // @ts-ignore
      PrependBit<BinaryPermutations<Decrement<N>>>;

}
