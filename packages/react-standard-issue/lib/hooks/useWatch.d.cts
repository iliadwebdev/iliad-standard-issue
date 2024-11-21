import { EffectCallback, DependencyList } from 'react';

declare function useWatch(func: EffectCallback, deps: DependencyList | undefined): void;

export { useWatch as default, useWatch };
