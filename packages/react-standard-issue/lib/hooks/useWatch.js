"use client";
import { useEffect, useRef } from "react";
function useWatch(func, deps) {
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current === true) {
      func();
    }
  }, deps);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
}
var useWatch_default = useWatch;
export {
  useWatch_default as default,
  useWatch
};
