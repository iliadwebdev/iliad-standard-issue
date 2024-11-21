/**
 * A version of useEffect that skips execution for a specified number of times.
 *
 * @param effect The effect callback function.
 * @param deps The dependency array.
 * @param skipCount The number of times to skip execution. Defaults to 1.
 */
declare function useDeferredEffect(effect: React.EffectCallback, deps?: React.DependencyList, skipCount?: number): void;

export { useDeferredEffect as default, useDeferredEffect };
