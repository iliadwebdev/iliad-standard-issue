// Utility type to get optional keys of T
export type OptionalKeys<T> = {
  [K in keyof T]-?: T extends Record<K, T[K]> ? never : K;
}[keyof T];
