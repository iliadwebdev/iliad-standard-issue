"use client";

import { useRef, useEffect } from "react";
import deepmerge from "deepmerge";

type DragScrollOptions = {
  axis: Array<"x" | "y">;
};

const defaultDragScrollOptions: DragScrollOptions = {
  axis: ["x", "y"],
};

export function useDragScroll(
  options: DragScrollOptions = defaultDragScrollOptions
) {
  const _options = deepmerge(defaultDragScrollOptions, options, {});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDragging = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      element.classList.add("dragging");
      startX = e.pageX - element.offsetLeft;
      startY = e.pageY - element.offsetTop;
      scrollLeft = element.scrollLeft;
      scrollTop = element.scrollTop;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const x = e.pageX - element.offsetLeft;
      const y = e.pageY - element.offsetTop;

      const walkX = x - startX;
      const walkY = y - startY;

      if (_options.axis.includes("x")) {
        element.scrollLeft = scrollLeft - walkX;
      }

      if (_options.axis.includes("y")) {
        element.scrollTop = scrollTop - walkY;
      }
    };

    const onMouseUpOrLeave = () => {
      isDragging = false;
      element.classList.remove("dragging");
    };

    element.addEventListener("mousedown", onMouseDown);
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseup", onMouseUpOrLeave);
    element.addEventListener("mouseleave", onMouseUpOrLeave);

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("mouseup", onMouseUpOrLeave);
      element.removeEventListener("mouseleave", onMouseUpOrLeave);
    };
  }, [_options]);

  return ref;
}
