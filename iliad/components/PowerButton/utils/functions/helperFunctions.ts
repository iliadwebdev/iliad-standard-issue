import type { Variants } from '../../index';
import type { MantineColor, MantineTheme } from '@mantine/core';

// Mantine
import { getThemeColor, darken, lighten } from '@mantine/core';

// Types
type PowerButtonColors = {
  lightest: string;
  lighter: string;
  light: string;
  color: string;
  dark: string;
  darker: string;
  darkest: string;
  style: Record<string, string>;
};

export function showIcon(variant: Variants) {
  return ['icon-button', 'icon-only', 'icon-text'].includes(variant);
}
export function showButtonText(variant: Variants) {
  return ['text-button', 'icon-button'].includes(variant);
}
export function showOrphanedText(variant: Variants) {
  return ['icon-text'].includes(variant);
}

export function getColors(
  colorKey: MantineColor | string,
  theme: MantineTheme,
  key: string = 'color'
): PowerButtonColors {
  const color = getThemeColor(colorKey, theme);
  const colors = {
    lightest: lighten(color, 0.7),
    lighter: lighten(color, 0.3),
    light: lighten(color, 0.1),
    color,
    dark: darken(color, 0.1),
    darker: darken(color, 0.3),
    darkest: darken(color, 0.7),
  };

  return {
    ...colors,
    style: {
      [`--${key}-lightest`]: colors.lightest,
      [`--${key}-lighter`]: colors.lighter,
      [`--${key}-light`]: colors.light,
      [`--${key}`]: colors.color,
      [`--${key}-dark`]: colors.dark,
      [`--${key}-darker`]: colors.darker,
      [`--${key}-darkest`]: colors.darkest,
    },
  };
}
