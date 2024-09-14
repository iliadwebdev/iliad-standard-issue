import { useState } from 'react';
import isEqual from 'react-fast-compare';

export default function useStateWithCustomComparator<T>(
  initialState: T,
  customEqualsComparator: (obj1: T, obj2: T) => boolean = isEqual
) {
  const [state, setState] = useState(initialState);

  const changeStateIfNotEqual = (newState: any) => {
    if (!customEqualsComparator(state, newState)) {
      setState(newState);
    }
  };

  return [state, changeStateIfNotEqual] as const;
}
