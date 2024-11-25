declare function isString(value: unknown): value is string;
declare function extendsString<T extends string>(value: T): T;

export { isString as default, extendsString, isString };
