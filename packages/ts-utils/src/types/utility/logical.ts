import type { XOR } from "ts-xor";

// LOGICAL UTILITY TYPES
// =====================

// Exclusive OR
export type OR<T, U> = T | U; // This is pretty useless, may remove.
export type { XOR };

// Boolean Narrowing

export type Falsy = false | 0 | "" | null | undefined;
export type Truthy = true | 1 | string | object | symbol; // Represents all truthy values
export type FalsyOrTruthy<T> = T | Falsy; // Makes a type falsy or truthy

export type FalsyPart<T> = Extract<T, Falsy>; // Returns the falsy part of a type
export type NotFalsy<T> = Exclude<T, Falsy>; // Returns the non-falsy part of a type

export type Falsable<T> = T | false; // Makes a type falsable
export type Nullable<T> = T | null; // Makes a type nullable
