"use client";
import { useRef } from "react";

function useImmediateMemo<T>(factory: () => T, deps: readonly unknown[]): T {
  const previousDepsRef = useRef<readonly unknown[]>();
  const valueRef = useRef<T>();

  // Check if dependencies have changed
  const depsChanged =
    !previousDepsRef.current || !depsAreSame(previousDepsRef.current, deps);

  if (depsChanged) {
    // Compute and store the new value
    valueRef.current = factory();
    previousDepsRef.current = deps;
  }

  return valueRef.current!;
}

function depsAreSame(
  oldDeps: readonly unknown[],
  newDeps: readonly unknown[]
): boolean {
  if (oldDeps.length !== newDeps.length) {
    return false;
  }

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], newDeps[i])) {
      return false;
    }
  }

  return true;
}

export default useImmediateMemo;
