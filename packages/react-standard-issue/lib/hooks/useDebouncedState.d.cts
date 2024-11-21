import { SetStateAction } from 'react';

type Options = {
    leading: boolean;
};
declare function useDebouncedState<T = any>(defaultValue: T, wait: number, options?: Options): readonly [T, (newValue: SetStateAction<T>) => void];

export { useDebouncedState };
