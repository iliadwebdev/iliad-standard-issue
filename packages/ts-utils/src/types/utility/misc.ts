import type { RecursiveRequiredHelper } from "../internal_utility/RecursiveRequiredHelper";
import type { OptionalKeys } from "../internal_utility/OptionalKeys";
import type { Enumerate } from "../internal_utility/Enumerate";

export type PickOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>; // Copy a type and make some fields optional
export type Optional<T> = undefined | T; // Makes a type explicitely optional

export type NamedTuple<T extends readonly unknown[]> = {
  [K in keyof T]: T[K];
};

// Recursive_Required<T> recursively makes all fields of T required. Useful for taking params that were optional and making a type that has been populated with default values.
export type Recursive_Required<T> = {
  [K in keyof T]-?: RecursiveRequiredHelper<T[K]>;
};

// Where did things go wrong?
export type Legacy_Recursive_Required<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? Legacy_Recursive_Required<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

// Semantic alias of Recursive_OptionalFieldsOf<T>
export type DefaultParams<T> = Recursive_OptionalFieldsOf<T>;

// OptionalFieldsOf<T> picks all optional fields of T and makes them required. Very useful for making a type that represents the default values for something that aren't already required.
export type OptionalFieldsOf<T> = {
  [K in OptionalKeys<T>]-?: T[K];
};

// Recursive_OptionalFieldsOf<T> recursively picks optional fields and makes them required.
export type Recursive_OptionalFieldsOf<T> = T extends object
  ? {
      [K in OptionalKeys<T>]-?: Recursive_OptionalFieldsOf<T[K]>;
    }
  : T;

// GENERATOR UTILITIES
// ===================
export type NumericalRange<F extends number, T extends number> = IntRange<F, T>;
export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;
