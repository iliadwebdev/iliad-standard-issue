// STRING UTILITIES
// ================

export type StartsWith<
  T extends string,
  C extends string = ""
> = T extends `${C}${string}` ? T : never;

export type EndsWith<
  T extends string,
  C extends string = ""
> = T extends `${string}${C}` ? T : never;
