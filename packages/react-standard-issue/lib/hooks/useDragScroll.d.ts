import * as react from 'react';

type DragScrollOptions = {
    axis: Array<"x" | "y">;
};
declare function useDragScroll(options?: DragScrollOptions): react.RefObject<HTMLDivElement>;

export { useDragScroll };
