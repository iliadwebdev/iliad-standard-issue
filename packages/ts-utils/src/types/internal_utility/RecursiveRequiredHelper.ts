import { Recursive_Required } from "../utility/misc";
import { Falsable } from "../utility/logical";
import { Optional } from "../utility/misc";

// Copies definitions of custom utility types
export type RecursiveRequiredHelper<T> = T extends Falsable<infer U>
  ? Falsable<Recursive_Required<U>>
  : T extends Optional<infer U>
  ? Optional<Recursive_Required<U>>
  : NonNullable<T> extends object
  ? Recursive_Required<NonNullable<T>>
  : NonNullable<T>;
