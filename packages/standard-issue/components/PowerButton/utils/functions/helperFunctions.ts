import { BinaryPermutations } from "@iliad.dev/ts-utils/@types";

import type { Variants, PowerButtonProps } from "../../index";
import type {
  DefaultMantineColor,
  MantineColor,
  MantineTheme,
} from "@mantine/core";

// Mantine
import { getThemeColor, darken, lighten } from "@mantine/core";

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

export function mergeProps<T = PowerButtonProps>(
  ...props: Array<(Partial<T> & Record<string, any>) | undefined>
): Partial<T> {
  const _props = props.filter((p) => !!p);
  return Object.assign({}, ..._props);
}

export function showIcon(variant: Variants) {
  return ["icon-button", "icon-only", "icon-text"].includes(variant);
}
export function showButtonText(variant: Variants) {
  return ["text-button", "icon-button"].includes(variant);
}
export function showOrphanedText(variant: Variants) {
  return ["icon-text"].includes(variant);
}

export function calculateColors(
  color: DefaultMantineColor,
  theme: MantineTheme,
  backgroundColor?: string | boolean
): Partial<PowerButtonColors> {
  let _colors = getColors(color, theme);

  if (typeof backgroundColor === "string") {
    _colors.style = {
      ..._colors.style,
      ...getColors(backgroundColor, theme, "background-color").style,
    };
  }

  return _colors;
}

export function getColors(
  colorKey: MantineColor | string,
  theme: MantineTheme,
  key: string = "color"
): Partial<PowerButtonColors> {
  return {
    style: {
      [`--${key}`]: lighten(getThemeColor(colorKey, theme), 0),
    },
  };
}

export function getVariantFromProps(text: any, icon: any): Variants {
  // @ts-ignore
  const p: Record<BinaryPermutations<2>, Variants> = {
    "11": "icon-button",
    "10": "text-button",
    "00": "icon-only",
    "01": "icon-text",
  };

  const c = [Number(!!text), Number(!!icon)].join("") as keyof typeof p;

  console.log("getVariantFromProps", { text, icon, c, p }, p[c]);

  return p[c];
}
