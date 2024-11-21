"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";





var _react = require('react');
const defaultOptions = {
  leading: false
};
function useDebouncedState(defaultValue, wait, options = defaultOptions) {
  const [value, setValue] = _react.useState.call(void 0, defaultValue);
  const timeoutRef = _react.useRef.call(void 0, null);
  const leadingRef = _react.useRef.call(void 0, true);
  const clearTimeout = () => window.clearTimeout(timeoutRef.current);
  _react.useEffect.call(void 0, () => clearTimeout, []);
  const debouncedSetValue = _react.useCallback.call(void 0, 
    (newValue) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          leadingRef.current = true;
          setValue(newValue);
        }, wait);
      }
      leadingRef.current = false;
    },
    [options.leading]
  );
  return [value, debouncedSetValue];
}


exports.useDebouncedState = useDebouncedState;
