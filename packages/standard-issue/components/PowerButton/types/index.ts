import type { ButtonProps, MantineColor, TextProps } from "@mantine/core";
import type { ComponentType, ComponentProps, ReactNode } from "react";
import type { IconType, IconBaseProps } from "react-icons";
import type { ExtLinkProps } from "../../ExtLink";
import type { BaseIcon } from "../base-icons";

type ModifiedButtonProps = Omit<ButtonProps, "fullWidth">;
export type StrapiButtonComponentProps = {
  color?: string;
  text?: string;
  icon?: string;
  link: string;
};

export type PowerButtonProps<T extends ComponentType<any> = any> =
  ComponentBaseProps &
    ExtLinkProps &
    ModifiedButtonProps & {
      extLinkProps?: Partial<ExtLinkProps>;
      backgroundColor?: boolean | string;
      iconPosition?: "left" | "right";
      attemptIdSmoothScroll?: boolean;
      icon?: IconProp | BaseIcon | T;
      mobileClickTimeout?: number;
      mobileDoubleTap?: boolean;
      iconProps?: IconBaseProps;
      mobileRipples?: boolean;
      textProps?: TextProps;
      color?: MantineColor;
      fullWidth?: boolean;
      variant?: Variants;
      iconSize?: number;

      // Additional components
      injectedComponents?: ReactNode;

      /**
       * @deprecated Adding this was a mistake. Please use the fullWidth prop exposed by Mantine instead.
       */
      useFullWidth?: boolean;
    } & {
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
    } & (T extends ComponentType<any> ? ComponentProps<T> : {});

export type IconProp<E = {}> = IconType | ReactNode | E;
export type Variants = (
  | "icon-button"
  | "text-button"
  | "icon-only"
  | "icon-text"
) & {};
