"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";
var _react = require('react');
function useImmediateMemo(factory, deps) {
  const previousDepsRef = _react.useRef.call(void 0, );
  const valueRef = _react.useRef.call(void 0, );
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


exports.default = useImmediateMemo_default;
