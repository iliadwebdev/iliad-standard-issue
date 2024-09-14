type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type NumericalRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

type NetworkResponse<T> =
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
type StandardResponse<T> = NetworkResponse<T>;
