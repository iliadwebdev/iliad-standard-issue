"use client";
import { useEffect, useState, useRef } from "react";

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

export default function useAbsolutePosition(
  container?: Element | Window | Document | null
): AbsPositionHook {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState<AbsolutePosition>({
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  });

  useEffect(() => {
    // Determine the container element
    const currentContainer =
      container instanceof Window || !container
        ? document.documentElement
        : container;

    const getElementPosition = (
      element: HTMLElement,
      container: Element | null
    ) => {
      let x = 0,
        y = 0;
      let el: HTMLElement | null = element;

      // Accumulate the offsets up to the container
      while (el && el !== container) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }

      // Subtract the scroll positions of parent elements
      el = element.parentElement;
      while (el && el !== container) {
        x -= el.scrollLeft || 0;
        y -= el.scrollTop || 0;
        el = el.parentElement;
      }

      return { left: x, top: y };
    };

    const updatePosition = () => {
      if (ref.current) {
        const elementPos = getElementPosition(
          ref.current,
          currentContainer as Element
        );
        const rect = ref.current.getBoundingClientRect();

        setPos({
          top: elementPos.top,
          left: elementPos.left,
          right: elementPos.left + rect.width,
          bottom: elementPos.top + rect.height,
        });
      }
    };

    updatePosition();

    // Listen to scroll and resize events
    const scrollElement =
      currentContainer && "addEventListener" in currentContainer
        ? currentContainer
        : window;

    scrollElement.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      scrollElement.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [container]);

  return { ref, pos };
}

export { useAbsolutePosition };
