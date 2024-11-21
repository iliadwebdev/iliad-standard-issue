"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";
var _react = require('react');
function useDeferredEffect(effect, deps, skipCount = 1) {
  const skipRef = _react.useRef.call(void 0, skipCount);
  _react.useEffect.call(void 0, () => {
    if (skipRef.current > 0) {
      skipRef.current -= 1;
      return;
    }
    return effect();
  }, deps);
}
var useDeferredEffect_default = useDeferredEffect;



exports.default = useDeferredEffect_default; exports.useDeferredEffect = useDeferredEffect;
