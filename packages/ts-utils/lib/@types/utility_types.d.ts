import { IUtils } from './internalUtils.js';

type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OR<T, U> = T | U;
type NetworkError = {
    message: string;
    code: number;
};
type ErrorResponse<E = {
    message: string;
    code: number;
}> = {
    data?: undefined;
    error: E;
};
type StandardResponse<T, E = NetworkError> = XOR<{
    data: T;
    error?: undefined;
}, ErrorResponse<E>>;
type FalsyPart<T> = Extract<T, IUtils.Falsy>;
type NotFalsy<T> = Exclude<T, IUtils.Falsy>;
type Falsable<T> = T | false;
type Nullable<T> = T | null;
type PickOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Optional<T> = undefined | T;
type Recursive_Required<T> = {
    [K in keyof T]-?: IUtils.RecursiveRequiredHelper<T[K]>;
};
type Legacy_Recursive_Required<T> = {
    [K in keyof T]-?: NonNullable<T[K]> extends object ? Legacy_Recursive_Required<NonNullable<T[K]>> : NonNullable<T[K]>;
};
type DefaultParams<T> = Recursive_OptionalFieldsOf<T>;
type OptionalFieldsOf<T> = {
    [K in IUtils.OptionalKeys<T>]-?: T[K];
};
type Recursive_OptionalFieldsOf<T> = T extends object ? {
    [K in IUtils.OptionalKeys<T>]-?: Recursive_OptionalFieldsOf<T[K]>;
} : T;
type BinaryPermutations<N extends number> = N extends 0 ? "" : PrependBit<BinaryPermutations<Decrement<N>>>;
type NumericalRange<F extends number, T extends number> = IntRange<F, T>;
type IntRange<F extends number, T extends number> = Exclude<IUtils.Enumerate<T>, IUtils.Enumerate<F>>;

export type { BinaryPermutations, DefaultParams, ErrorResponse, Falsable, FalsyPart, IntRange, Legacy_Recursive_Required, NotFalsy, Nullable, NumericalRange, OR, Optional, OptionalFieldsOf, PickOptional, Recursive_OptionalFieldsOf, Recursive_Required, StandardResponse, Without, XOR };
