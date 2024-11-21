"use client";

import { useEffect, useState, useRef, useCallback } from "react";

function CSSUnitToPxNumber(value?: string) {
  if (!value) return 0;
  // Rem, em, pt, px, cm, mm, in, pc, vh, vw, vmin, vmax
  const unit = value.match(/[a-z]+/);
  if (!unit) return 0;
  const unitValue = parseFloat(value);
  switch (unit[0]) {
    case "rem":
      return (
        unitValue *
        parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    case "em":
      return unitValue * parseFloat(getComputedStyle(document.body).fontSize);
    case "pt":
      return (unitValue * 96) / 72;
    case "cm":
      return (unitValue * 96) / 2.54;
    case "mm":
      return (unitValue * 96) / 25.4;
    case "in":
      return unitValue * 96;
    case "pc":
      return unitValue * 16;
    case "vh":
      return (unitValue * window.innerHeight) / 100;
    case "vw":
      return (unitValue * window.innerWidth) / 100;
    case "vmin":
      return (
        (unitValue * Math.min(window.innerHeight, window.innerWidth)) / 100
      );
    case "vmax":
      return (
        (unitValue * Math.max(window.innerHeight, window.innerWidth)) / 100
      );
    default:
      return unitValue;
  }
}

export default function useComputedStyle() {
  const element = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState<CSSStyleDeclaration | null>(null);

  useEffect(() => {
    if (element?.current) {
      setStyle(window.getComputedStyle(element.current));
    }
  }, [element]);

  return { ref: element, style, CSSUnitToPxNumber };
}

export { CSSUnitToPxNumber, useComputedStyle };
