"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";
var _react = require('react');
function useAbsolutePosition(container) {
  const ref = _react.useRef.call(void 0, null);
  const [pos, setPos] = _react.useState.call(void 0, {
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  });
  _react.useEffect.call(void 0, () => {
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



exports.default = useAbsolutePosition; exports.useAbsolutePosition = useAbsolutePosition;
