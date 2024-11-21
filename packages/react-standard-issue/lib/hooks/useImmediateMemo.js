"use client";
import { useRef } from "react";
function useImmediateMemo(factory, deps) {
  const previousDepsRef = useRef();
  const valueRef = useRef();
  const depsChanged = !previousDepsRef.current || !depsAreSame(previousDepsRef.current, deps);
  if (depsChanged) {
    valueRef.current = factory();
    previousDepsRef.current = deps;
  }
  return valueRef.current;
}
function depsAreSame(oldDeps, newDeps) {
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
var useImmediateMemo_default = useImmediateMemo;
export {
  useImmediateMemo_default as default
};
