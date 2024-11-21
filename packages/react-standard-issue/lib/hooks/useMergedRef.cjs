"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";
var _react = require('react');
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
  return _react.useCallback.call(void 0, mergeRefs(...refs), refs);
}
var useMergedRef_default = useMergedRef;





exports.assignRef = assignRef; exports.default = useMergedRef_default; exports.mergeRefs = mergeRefs; exports.useMergedRef = useMergedRef;
