// Styles
import styles from "./ext-link.module.scss";
import clsx from "clsx";

// React / Next
import Link from "next/link";

// Components
import ExternalAnchor from "./ExternalAnchor";

// Functions
import {
  notIliad,
  isLinkExternal,
  willRenderLink,
  extractLinkProps,
  normalizeRootDomain,
} from "./utils/functions/helperFunctions";

// Types
import type { ContextModalProps } from "@mantine/modals";
import type { LinkProps } from "next/link";
import {
  BoxComponentProps,
  PolymorphicComponentProps,
  Box,
} from "@mantine/core";
import { ElementType, forwardRef } from "react";
export type ExtLinkProps<C extends OptDom = "a"> = ComponentBaseProps<C> &
  Omit<LinkProps, "href"> & {
    externalWarningModalProps?: ContextModalProps;
    externalWarningModal?: string | boolean;
    microSite?: boolean;
    href?: string;
  };

export type TransformedExtLinkProps<C extends OptDom = "a"> =
  ExtLinkProps<C> & {
    external: boolean;
    target?: string;
    href?: string;
    rel?: string;
    externalWarning?: {
      externalWarningModalProps: ContextModalProps;
      enabled: boolean;
      modal: string;
    };
  };

// Constants
const DEFAULT_MODAL_NAME = "ExternalLinkWarningModal";

function transformExtLinkProps(Component: any, microSite: boolean = false) {
  return function ExtLink({
    externalWarningModal = true,
    href,
    ...props
  }: ExtLinkProps) {
    if (props?.microSite) {
      microSite = props.microSite;
    }

    if (microSite) {
      // Micro-sites will append the root domain to the href
      // And open in the current tab
      handleMicroSite: {
        if (!href) break handleMicroSite;

        if (!process?.env?.NEXT_PUBLIC_MICRO_SITE_ROOT_DOMAIN) {
          console.warn(
            `[Iliad] Micro-site root domain not set. Please set the NEXT_PUBLIC_MICRO_SITE_ROOT_DOMAIN environment variable.`
          );
          break handleMicroSite;
        }

        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[Iliad] Micro-site root domain is set. Skipping href transformation in development.`
          );
          break handleMicroSite;
        }

        const rootDomain = normalizeRootDomain(
          process.env.NEXT_PUBLIC_MICRO_SITE_ROOT_DOMAIN
        );

        if (href.startsWith("/")) {
          href = `${rootDomain}${href}`;
        }
      }
    }

    const external = !!href ? isLinkExternal(href) : false;

    const transformedProps: TransformedExtLinkProps = {
      external,
      href,
      ...props,
    };

    // NOTE: TODO: This is AIDS
    if (externalWarningModal && notIliad(href)) {
      let modalName = DEFAULT_MODAL_NAME || "default";

      if (typeof externalWarningModal === "string") {
        modalName = externalWarningModal;
      }

      transformedProps.externalWarning = {
        externalWarningModalProps:
          props?.externalWarningModalProps || ({} as ContextModalProps),
        modal: modalName,
        enabled: true,
      };
    } else {
      transformedProps.externalWarning = {
        externalWarningModalProps: {} as ContextModalProps,
        modal: "default",
        enabled: false,
      };
    }

    if (external) {
      transformedProps.rel = "noopener noreferrer";
      if (!microSite) {
        transformedProps.target = "_blank";
      }
    }

    const classNames = [styles.extLink, props.className, "iliad-ExtLink-root"];

    if (willRenderLink(href)) {
      classNames.push("iliad-ExtLink-valid");
    }

    transformedProps.className = clsx(...classNames);

    // Remove this property, until used to prevent passing it to DOM elements
    delete transformedProps.microSite;

    return <Component {...transformedProps} />;
  };
}

function ExtLinkBaseComponent({
  externalWarning,
  className,
  external,
  children,
  href,
  ...props
}: TransformedExtLinkProps) {
  const _props = { ...props, className: clsx(className) };

  if (!href)
    return (
      <CommonLinkBox component="a" {..._props}>
        {children}
      </CommonLinkBox>
    );
  const __props = { ..._props, href };

  // Internal links are rendered with Next.js Link
  if (!external) {
    return (
      <CommonLinkBox component={Link} {...__props}>
        {children}
      </CommonLinkBox>
    );
  }

  // If the link is external, and the external warning modal is enabled
  // we must render a client-side version of the tag to access the
  // mantine modal context
  if (externalWarning?.enabled === true) {
    return (
      <ExternalAnchor modal={externalWarning.modal} {...__props}>
        {children}
      </ExternalAnchor>
    );
  }

  // If this is an external link with no special logic, simply render an anchor tag
  return <CommonLinkBox {...__props}>{children}</CommonLinkBox>;
}

export const CommonLinkBox = <C extends React.ElementType = "a">({
  component = "a",
  ...props
}: PolymorphicComponentProps<C, BoxComponentProps>) => {
  return <Box component={component as any} {...props} />;
};

export const ExtLink = transformExtLinkProps(ExtLinkBaseComponent, false);
export const MicroLink = transformExtLinkProps(ExtLinkBaseComponent, true);

export { willRenderLink, isLinkExternal, extractLinkProps };
export default ExtLink;
