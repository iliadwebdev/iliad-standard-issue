// TYPE DECLARATION UTILITIES
// ==========================
export type LiteralUnion<T extends U, U = string> = T | (U & {}); // Allows for a union of string literals, while also allowing arbitrary strings. Preserves autocomplete.
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export * from "./control_flow";
export * from "./logical";
export * from "./string";
export * from "./array";
export * from "./index";
export * from "./misc";
