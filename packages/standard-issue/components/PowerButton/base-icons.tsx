import { ComponentType } from "react";
import {
  FaArrowUp,
  FaArrowLeft,
  FaArrowDown,
  FaArrowRight,
} from "react-icons/fa";
import { AnimatedScrollIcon, ScrollIcon } from "../icons";

export type BaseIcon = (
  | "animatedScroll"
  | "arrowRight"
  | "arrowDown"
  | "arrowLeft"
  | "arrowUp"
  | "scroll"
) & {};

export const baseIcons: Record<BaseIcon, ComponentType<any>> = {
  animatedScroll: AnimatedScrollIcon,
  arrowRight: FaArrowRight,
  arrowDown: FaArrowDown,
  arrowLeft: FaArrowLeft,
  scroll: ScrollIcon,
  arrowUp: FaArrowUp,
};
