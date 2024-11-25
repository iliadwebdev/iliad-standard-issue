export { extendsString, isString } from './isString.js';

declare function extendsType<P extends T, T = unknown>(value: T): value is P;

export { extendsType };
