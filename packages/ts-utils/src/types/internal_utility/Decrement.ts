import type { BuildArray } from "./BuildArray";
// Helper type to decrement a number
export type Decrement<N extends number> = BuildArray<N> extends [
  infer _,
  ...infer Rest
]
  ? Rest["length"]
  : never;
