"use client";
import {
  useState,
  useRef,
  useEffect,
  useCallback
} from "react";
const defaultOptions = {
  leading: false
};
function useDebouncedState(defaultValue, wait, options = defaultOptions) {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef(null);
  const leadingRef = useRef(true);
  const clearTimeout = () => window.clearTimeout(timeoutRef.current);
  useEffect(() => clearTimeout, []);
  const debouncedSetValue = useCallback(
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
export {
  useDebouncedState
};
