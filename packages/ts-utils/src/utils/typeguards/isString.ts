export default function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function extendsString<T extends string>(value: T): T {
  return value;
}

export { isString };
