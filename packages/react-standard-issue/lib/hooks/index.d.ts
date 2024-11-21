export { useAbsolutePosition } from './useAbsolutePosition.js';
export { default as useDeferredEffect } from './useDeferredEffect.js';
export { useDebouncedState } from './useDebouncedState.js';
export { CSSUnitToPxNumber, useComputedStyle } from './useComputedStyle.js';
export { useDragScroll } from './useDragScroll.js';
export { assignRef, mergeRefs, useMergedRef } from './useMergedRef.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';

declare function useRipple(rippleClassName?: string): (string | react.MutableRefObject<null> | react_jsx_runtime.JSX.Element[])[];
declare function useRipples(rippleClassName?: string): (string | ((element: any, key: any) => any))[];

export { useRipple, useRipples };
