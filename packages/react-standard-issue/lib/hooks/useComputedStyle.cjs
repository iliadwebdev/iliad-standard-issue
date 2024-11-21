"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";
var _react = require('react');
function CSSUnitToPxNumber(value) {
  if (!value) return 0;
  const unit = value.match(/[a-z]+/);
  if (!unit) return 0;
  const unitValue = parseFloat(value);
  switch (unit[0]) {
    case "rem":
      return unitValue * parseFloat(getComputedStyle(document.documentElement).fontSize);
    case "em":
      return unitValue * parseFloat(getComputedStyle(document.body).fontSize);
    case "pt":
      return unitValue * 96 / 72;
    case "cm":
      return unitValue * 96 / 2.54;
    case "mm":
      return unitValue * 96 / 25.4;
    case "in":
      return unitValue * 96;
    case "pc":
      return unitValue * 16;
    case "vh":
      return unitValue * window.innerHeight / 100;
    case "vw":
      return unitValue * window.innerWidth / 100;
    case "vmin":
      return unitValue * Math.min(window.innerHeight, window.innerWidth) / 100;
    case "vmax":
      return unitValue * Math.max(window.innerHeight, window.innerWidth) / 100;
    default:
      return unitValue;
  }
}
function useComputedStyle() {
  const element = _react.useRef.call(void 0, null);
  const [style, setStyle] = _react.useState.call(void 0, null);
  _react.useEffect.call(void 0, () => {
    if (_optionalChain([element, 'optionalAccess', _ => _.current])) {
      setStyle(window.getComputedStyle(element.current));
    }
  }, [element]);
  return { ref: element, style, CSSUnitToPxNumber };
}




exports.CSSUnitToPxNumber = CSSUnitToPxNumber; exports.default = useComputedStyle; exports.useComputedStyle = useComputedStyle;
