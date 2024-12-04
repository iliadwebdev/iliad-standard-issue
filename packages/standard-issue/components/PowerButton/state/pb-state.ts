import "@iliad.dev/primitive-extensions";

import {
  DefaultMantineColor,
  getThemeColor,
  lighten,
  darken,
} from "@mantine/core";
import { create } from "zustand";

type ButtonCache = {
  colors: Record<string, ColorCalc>;
};

type ColorCalc = {
  lightest: string;
  lighter: string;
  light: string;
  color: string;
  dark: string;
  darker: string;
  darkest: string;
};

const useButtonCache = create<ButtonCache>((set) => ({
  colors: {},
}));

function getColors(colorKey, theme) {
  const color = getThemeColor(colorKey, theme);
  return {
    lightest: lighten(color, 0.7),
    lighter: lighten(color, 0.3),
    light: lighten(color, 0.1),
    color: lighten(color, 0),
    dark: darken(color, 0.1),
    darker: darken(color, 0.3),
    darkest: darken(color, 0.7),
  };
}

// Getters/setters
export function getColorKey(
  color: DefaultMantineColor,
  theme,
  backgroundColor?: string
): ColorKeys {
  const key = color.hash64();
  const bgKey = backgroundColor ? backgroundColor.hash64() : "none";

  // Attempt to hit the cache
  const cached = useButtonCache.getState().colors[key];
  if (!cached) {
    // Womp womp, cache miss
    const colors = getColors(color, theme);
    const bgColors = getColors(backgroundColor, theme);

    useButtonCache.setState((state) => ({
      colors: {
        ...state.colors,
        [bgKey]: bgColors,
        [key]: colors,
      },
    }));
  }

  return [key, bgKey];
}

export type ColorKeys = [string, string];
export { useButtonCache };
