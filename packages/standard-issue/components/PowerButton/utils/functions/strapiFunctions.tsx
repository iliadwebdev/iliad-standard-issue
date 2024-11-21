import {
  DynamicReactIcon,
  type PowerButtonProps,
  type StrapiButtonComponentProps,
} from "@iliad/components";

import { getVariantFromProps } from "./helperFunctions";

const buttonPropsFromStrapi = ({
  color,
  text,
  link,
  icon,
}: Partial<StrapiButtonComponentProps>): Partial<PowerButtonProps> => {
  const _props: Partial<PowerButtonProps> = {
    icon: <DynamicReactIcon name={icon as string} />,
    variant: getVariantFromProps(text, icon),
    children: text,
    href: link,
    color,
  };

  return _props;
};

export default buttonPropsFromStrapi;
export { buttonPropsFromStrapi };
