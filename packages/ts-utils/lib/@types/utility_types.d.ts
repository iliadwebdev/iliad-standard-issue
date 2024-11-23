type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OR<T, U> = T | U;
type NetworkResponse<T, E = {
    message: string;
    code: number;
}> = XOR<{
    data: T;
    error?: undefined;
}, {
    data?: undefined;
    error: E;
}>;
type StandardResponse<T> = NetworkResponse<T>;
type Falsy = false | 0 | "" | null | undefined;
type FalsyPart<T> = Extract<T, Falsy>;
type NotFalsy<T> = Exclude<T, Falsy>;
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Nullable<T> = T | null;
type NumericalRange<F extends number, T extends number> = IntRange<F, T>;
type BuildArray<Length extends number, Accumulator extends unknown[] = []> = Accumulator["length"] extends Length ? Accumulator : BuildArray<Length, [...Accumulator, unknown]>;
type Decrement<N extends number> = BuildArray<N> extends [
    infer _,
    ...infer Rest
] ? Rest["length"] : never;
type PrependBit<T extends string> = T extends string ? `0${T}` | `1${T}` : never;
type BinaryPermutations<N extends number> = N extends 0 ? "" : PrependBit<BinaryPermutations<Decrement<N>>>;
type Recursive_Required<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends object ? Recursive_Required<NonNullable<T[K]>> : NonNullable<T[K]>;
};
type OptionalKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
}[keyof T];
type OptionalFieldsOf<T> = {
    [K in OptionalKeys<T>]-?: T[K];
};
type Recursive_OptionalFieldsOf<T> = T extends object ? {
    [K in OptionalKeys<T>]-?: Recursive_OptionalFieldsOf<T[K]>;
} : T;
type DefaultParams<T> = Recursive_OptionalFieldsOf<T>;

export type { BinaryPermutations, DefaultParams, Falsy, FalsyPart, IntRange, NetworkResponse, NotFalsy, Nullable, NumericalRange, OR, Optional, OptionalFieldsOf, Recursive_OptionalFieldsOf, Recursive_Required, StandardResponse, Without, XOR };
