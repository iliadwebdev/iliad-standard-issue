export * from "./isString";

export function extendsType<P extends T, T = unknown>(value: T): value is P {
  return true;
}
