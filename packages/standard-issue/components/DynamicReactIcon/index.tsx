"use client";

// Utils
import loadable from "@loadable/component";

// Types

import type { IconType } from "react-icons";
import type { DOMAttributes } from "react";
export type DynamicReactIconProps = IDynamicReactIcon & ComponentBaseProps;
export interface IDynamicReactIcon extends DOMAttributes<SVGElement> {
  name: IReactIcon;
  size?: number;
}

export type IReactIcon = string;

const iconComponents = {
  Lia: () => import("react-icons/lia"),
  Tfi: () => import("react-icons/tfi"),
  Vsc: () => import("react-icons/vsc"),
  Hi: () => import("react-icons/hi2"),
  Fa: () => import("react-icons/fa6"),
  Io: () => import("react-icons/io5"),
  Ai: () => import("react-icons/ai"),
  Bs: () => import("react-icons/bs"),
  Bi: () => import("react-icons/bi"),
  Ci: () => import("react-icons/ci"),
  Di: () => import("react-icons/di"),
  Fi: () => import("react-icons/fi"),
  Fc: () => import("react-icons/fc"),
  Gi: () => import("react-icons/gi"),
  Go: () => import("react-icons/go"),
  Gr: () => import("react-icons/gr"),
  Im: () => import("react-icons/im"),
  Lu: () => import("react-icons/lu"),
  Md: () => import("react-icons/md"),
  Pi: () => import("react-icons/pi"),
  Rx: () => import("react-icons/rx"),
  Ri: () => import("react-icons/ri"),
  Si: () => import("react-icons/si"),
  Sl: () => import("react-icons/sl"),
  Tb: () => import("react-icons/tb"),
  Ti: () => import("react-icons/ti"),
  Wi: () => import("react-icons/wi"),
  Cg: () => import("react-icons/cg"),
} as Record<string, () => Promise<Record<string, any>>>;

const DynamicReactIcon = ({ name, ...rest }: DynamicReactIconProps) => {
  const lib = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(" ")[0];
  const iconComponent = iconComponents[lib];

  if (!iconComponent) return <></>;

  const DynamicIcon = loadable(iconComponent, {
    resolveComponent: (el) => el[name],
  }) as IconType;

  return <DynamicIcon {...rest} />;
};

export default DynamicReactIcon;
export { DynamicReactIcon };
