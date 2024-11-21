"use client";
import { useEffect, useState, useRef } from "react";
function useAbsolutePosition(container) {
  const ref = useRef(null);
  const [pos, setPos] = useState({
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  });
  useEffect(() => {
    const currentContainer = container instanceof Window || !container ? document.documentElement : container;
    const getElementPosition = (element, container2) => {
      let x = 0, y = 0;
      let el = element;
      while (el && el !== container2) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      el = element.parentElement;
      while (el && el !== container2) {
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
          currentContainer
        );
        const rect = ref.current.getBoundingClientRect();
        setPos({
          top: elementPos.top,
          left: elementPos.left,
          right: elementPos.left + rect.width,
          bottom: elementPos.top + rect.height
        });
      }
    };
    updatePosition();
    const scrollElement = currentContainer && "addEventListener" in currentContainer ? currentContainer : window;
    scrollElement.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    return () => {
      scrollElement.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [container]);
  return { ref, pos };
}
export {
  useAbsolutePosition as default,
  useAbsolutePosition
};
