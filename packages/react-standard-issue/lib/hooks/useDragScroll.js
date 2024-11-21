"use client";
import { useRef, useEffect } from "react";
import deepmerge from "deepmerge";
const defaultDragScrollOptions = {
  axis: ["x", "y"]
};
function useDragScroll(options = defaultDragScrollOptions) {
  const _options = deepmerge(defaultDragScrollOptions, options, {});
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let isDragging = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;
    const onMouseDown = (e) => {
      isDragging = true;
      element.classList.add("dragging");
      startX = e.pageX - element.offsetLeft;
      startY = e.pageY - element.offsetTop;
      scrollLeft = element.scrollLeft;
      scrollTop = element.scrollTop;
    };
    const onMouseMove = (e) => {
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
export {
  useDragScroll
};
