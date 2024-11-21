"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";
var _react = require('react');
var _deepmerge = require('deepmerge'); var _deepmerge2 = _interopRequireDefault(_deepmerge);
const defaultDragScrollOptions = {
  axis: ["x", "y"]
};
function useDragScroll(options = defaultDragScrollOptions) {
  const _options = _deepmerge2.default.call(void 0, defaultDragScrollOptions, options, {});
  const ref = _react.useRef.call(void 0, null);
  _react.useEffect.call(void 0, () => {
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


exports.useDragScroll = useDragScroll;
