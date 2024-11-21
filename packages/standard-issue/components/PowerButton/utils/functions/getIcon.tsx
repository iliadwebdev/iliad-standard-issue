import { baseIcons, BaseIcon } from "../../base-icons";
import React, { ComponentType } from "react";
import { IconType } from "react-icons";
import { IconProp } from "../../types";

function isBaseIcon(icon: IconProp): icon is BaseIcon {
  return typeof icon === "string" && icon in baseIcons;
}

function isIconType(icon: IconProp): icon is IconType {
  return typeof icon === "function";
}
const IconFallback = (props: any) => <div />;

function getIcon(icon: IconProp): ComponentType<any> {
  if (isBaseIcon(icon)) {
    return baseIcons[icon];
  } else if (isIconType(icon)) {
    return icon;
  } else if (React.isValidElement(icon)) {
    // If icon is a React element, wrap it in a component
    return () => icon as React.ReactElement;
  } else {
    console.warn(`[Iliad] PowerButton: Invalid icon prop: ${icon}`);
    // Default fallback component
    return IconFallback;
  }
}

export default getIcon;
export { getIcon };
