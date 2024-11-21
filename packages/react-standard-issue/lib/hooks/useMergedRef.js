"use client";
import { useCallback } from "react";
function assignRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (typeof ref === "object" && ref !== null && "current" in ref) {
    ref.current = value;
  }
}
function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}
function useMergedRef(...refs) {
  return useCallback(mergeRefs(...refs), refs);
}
var useMergedRef_default = useMergedRef;
export {
  assignRef,
  useMergedRef_default as default,
  mergeRefs,
  useMergedRef
};
