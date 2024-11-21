export { useAbsolutePosition } from './useAbsolutePosition.cjs';
export { default as useDeferredEffect } from './useDeferredEffect.cjs';
export { useDebouncedState } from './useDebouncedState.cjs';
export { CSSUnitToPxNumber, useComputedStyle } from './useComputedStyle.cjs';
export { useDragScroll } from './useDragScroll.cjs';
export { assignRef, mergeRefs, useMergedRef } from './useMergedRef.cjs';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';

declare function useRipple(rippleClassName?: string): (string | react.MutableRefObject<null> | react_jsx_runtime.JSX.Element[])[];
declare function useRipples(rippleClassName?: string): (string | ((element: any, key: any) => any))[];

export { useRipple, useRipples };
