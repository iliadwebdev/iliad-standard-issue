// Type to prepend '0' and '1' to each string in a union
export type PrependBit<T extends string> = T extends string
  ? `0${T}` | `1${T}`
  : never;
