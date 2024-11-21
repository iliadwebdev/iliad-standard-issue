"use client";
import { useEffect, useRef } from "react";
function useDeferredEffect(effect, deps, skipCount = 1) {
  const skipRef = useRef(skipCount);
  useEffect(() => {
    if (skipRef.current > 0) {
      skipRef.current -= 1;
      return;
    }
    return effect();
  }, deps);
}
var useDeferredEffect_default = useDeferredEffect;
export {
  useDeferredEffect_default as default,
  useDeferredEffect
};
