type AbsolutePosition = {
    bottom: number;
    right: number;
    left: number;
    top: number;
};
type AbsPositionHook = {
    ref: React.RefObject<HTMLElement>;
    pos: AbsolutePosition;
};
declare function useAbsolutePosition(container?: Element | Window | Document | null): AbsPositionHook;

export { useAbsolutePosition as default, useAbsolutePosition };
