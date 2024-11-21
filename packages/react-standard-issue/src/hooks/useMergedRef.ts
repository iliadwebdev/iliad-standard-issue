"use client";
import { useCallback } from "react";

function assignRef(ref: React.Ref<any> | null, value: any): void {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (typeof ref === "object" && ref !== null && "current" in ref) {
    (ref as React.MutableRefObject<any>).current = value;
  }
}

function mergeRefs(...refs: (React.Ref<any> | null)[]): (node: any) => void {
  return (node) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

function useMergedRef<T>(
  ...refs: (React.Ref<T> | null)[]
): React.RefCallback<T> {
  return useCallback(mergeRefs(...refs), refs);
}

export { assignRef, mergeRefs, useMergedRef };
export default useMergedRef;
