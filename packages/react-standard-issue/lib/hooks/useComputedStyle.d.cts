import * as react from 'react';

declare function CSSUnitToPxNumber(value?: string): number;
declare function useComputedStyle(): {
    ref: react.MutableRefObject<HTMLElement | null>;
    style: CSSStyleDeclaration | null;
    CSSUnitToPxNumber: typeof CSSUnitToPxNumber;
};

export { CSSUnitToPxNumber, useComputedStyle as default, useComputedStyle };
