"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";
var _react = require('react');
function useWatch(func, deps) {
  const mounted = _react.useRef.call(void 0, false);
  _react.useEffect.call(void 0, () => {
    if (mounted.current === true) {
      func();
    }
  }, deps);
  _react.useEffect.call(void 0, () => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
}
var useWatch_default = useWatch;



exports.default = useWatch_default; exports.useWatch = useWatch;
