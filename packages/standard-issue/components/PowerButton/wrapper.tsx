import ConditionalWrapper from "../ConditionalWrapper";
import ExtLink, { willRenderLink } from "../ExtLink";
import { Box } from "@mantine/core";

import type { PowerButtonProps } from "./types";
type PBWProps = Partial<PowerButtonProps & Record<string, any>>;

// POWER BUTTON WRAPPER
const PBW = ({ children, extLinkProps, ...props }: PBWProps) => {
  return (
    <ConditionalWrapper
      condition={willRenderLink(props?.href)}
      wrapper={(_children) => {
        return (
          <Box component={ExtLink} {...{ ...props, ...extLinkProps }}>
            {_children}
          </Box>
        );
      }}
      falseWrapper={(_children) => {
        return (
          <Box component="button" {...(props as any)}>
            {_children}
          </Box>
        );
      }}
    >
      {children}
    </ConditionalWrapper>
  );
};

export default PBW;
export { PBW };
