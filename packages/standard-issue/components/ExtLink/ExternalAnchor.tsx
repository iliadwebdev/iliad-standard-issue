"use client";

// Styles
import clsx from "clsx";

// React
import { useCallback } from "react";

// Mantine
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

// Components
import { CommonLinkBox } from ".";

// Types
import { TransformedExtLinkProps } from ".";
import { normalizeRootDomain } from "./utils/functions/helperFunctions";

type ExternalAnchorProps = Omit<
  TransformedExtLinkProps,
  "externalWarning" | "external" // These are implicit in the component
> & {
  modal: string;
  href: string;
};

// Constants

const ExternalAnchor = ({
  onClick,
  modal,
  href,
  // Base props
  className,
  children,
  ...props
}: ExternalAnchorProps) => {
  const _props = { href, ...props };

  const handleAnchorClick = useCallback(
    (e) => {
      e.preventDefault();

      if (modal === "default") {
        modals.openConfirmModal({
          title: "Notice: External Site",
          children: (
            <Text size="sm">
              This action is so important that you are required to confirm it
              with a modal. Please click one of these buttons to proceed.
            </Text>
          ),
          labels: { confirm: "Proceed", cancel: "Cancel" },
          onConfirm: () => {
            console.log("proceeded");
          },
        });
        return;
      }

      modals.openContextModal({
        // title: `Notice: External Site`,

        withCloseButton: false,
        innerProps: {
          domain: new URL(normalizeRootDomain(href)).hostname,
          href,
        },
        modal,
      });
    },
    [onClick, modal, href]
  );

  return (
    <CommonLinkBox
      component="a"
      className={clsx(className, "iliad-ExtLink-modal")}
      onClick={(e) => {
        handleAnchorClick(e);
      }}
      {..._props}
    >
      {children}
    </CommonLinkBox>
  );
};

export default ExternalAnchor;
export { ExternalAnchor };
