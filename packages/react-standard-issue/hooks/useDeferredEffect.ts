"use client";

import { useEffect, useRef } from "react";

/**
 * A version of useEffect that skips execution for a specified number of times.
 *
 * @param effect The effect callback function.
 * @param deps The dependency array.
 * @param skipCount The number of times to skip execution. Defaults to 1.
 */
export function useDeferredEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
  skipCount: number = 1
) {
  const skipRef = useRef<number>(skipCount);

  useEffect(() => {
    if (skipRef.current > 0) {
      skipRef.current -= 1;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useDeferredEffect;
