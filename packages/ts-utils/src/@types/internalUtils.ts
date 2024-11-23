export namespace IUtils {
  // Helper type to build an array of a given length
  export type BuildArray<
    Length extends number,
    Accumulator extends unknown[] = []
  > = Accumulator["length"] extends Length
    ? Accumulator
    : BuildArray<Length, [...Accumulator, unknown]>;

  // Helper type to decrement a number
  export type Decrement<N extends number> = BuildArray<N> extends [
    infer _,
    ...infer Rest
  ]
    ? Rest["length"]
    : never;

  // Type to prepend '0' and '1' to each string in a union
  export type PrependBit<T extends string> = T extends string
    ? `0${T}` | `1${T}`
    : never;

  export type Falsy = false | 0 | "" | null | undefined;

  export type Enumerate<
    N extends number,
    Acc extends number[] = []
  > = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

  // Utility type to get optional keys of T
  export type OptionalKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
  }[keyof T];
}
