declare function useImmediateMemo<T>(factory: () => T, deps: readonly unknown[]): T;

export { useImmediateMemo as default };
