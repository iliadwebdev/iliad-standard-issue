declare namespace IUtils {
    type BuildArray<Length extends number, Accumulator extends unknown[] = []> = Accumulator["length"] extends Length ? Accumulator : BuildArray<Length, [...Accumulator, unknown]>;
    type Decrement<N extends number> = BuildArray<N> extends [
        infer _,
        ...infer Rest
    ] ? Rest["length"] : never;
    type PrependBit<T extends string> = T extends string ? `0${T}` | `1${T}` : never;
    type Falsy = false | 0 | "" | null | undefined;
    type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
    type OptionalKeys<T> = {
        [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
    }[keyof T];
    type RecursiveRequiredHelper<T> = T extends Falsable<infer U> ? Falsable<Recursive_Required<U>> : T extends Optional<infer U> ? Optional<Recursive_Required<U>> : NonNullable<T> extends object ? Recursive_Required<NonNullable<T>> : NonNullable<T>;
}

export { IUtils };
