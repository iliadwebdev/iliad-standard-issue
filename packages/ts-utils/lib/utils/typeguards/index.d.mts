export { extendsString, isString } from './isString.mjs';

declare function extendsType<P extends T, T = unknown>(value: T): value is P;

export { extendsType };
