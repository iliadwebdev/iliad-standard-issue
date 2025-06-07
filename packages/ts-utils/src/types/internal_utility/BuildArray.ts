// Helper type to build an array of a given length
export type BuildArray<
  Length extends number,
  Accumulator extends unknown[] = []
> = Accumulator["length"] extends Length
  ? Accumulator
  : BuildArray<Length, [...Accumulator, unknown]>;
