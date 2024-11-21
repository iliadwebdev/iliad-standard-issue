"use client";
import {
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

type Options = {
  leading: boolean;
};

const defaultOptions: Options = {
  leading: false,
};

function useDebouncedState<T = any>(
  defaultValue: T,
  wait: number,
  options: Options = defaultOptions
): readonly [T, (newValue: SetStateAction<T>) => void] {
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef(null);
  const leadingRef = useRef(true);

  // @ts-ignore
  const clearTimeout = () => window.clearTimeout(timeoutRef.current);

  useEffect(() => clearTimeout, []);
  const debouncedSetValue = useCallback(
    (newValue: any) => {
      clearTimeout();
      if (leadingRef.current && options.leading) {
        setValue(newValue);
      } else {
        // @ts-ignore
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

export { useDebouncedState };
