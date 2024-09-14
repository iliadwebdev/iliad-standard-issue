// Styles
import styles from './ext-link.module.scss';
import clsx from 'clsx';

// React / Next
import Link from 'next/link';

// Functions
import {
  isLinkExternal,
  willRenderLink,
  extractLinkProps,
  normalizeRootDomain,
} from './utils/functions/helperFunctions';

// Types
import { LinkProps } from 'next/link';

export type ExtLinkProps = ComponentBaseProps &
  Omit<LinkProps, 'href'> & {
    microSite?: boolean;
    href?: string;
  };

type TransformedExtLinkProps = ExtLinkProps & {
  external: boolean;
  target?: string;
  href?: string;
  rel?: string;
};

function transformExtLinkProps(Component: any, microSite: boolean = false) {
  return function ExtLink({ href, ...props }: ExtLinkProps) {
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

        // if (process.env.NODE_ENV !== 'production') {
        //   console.warn(
        //     `[Iliad] Micro-site root domain is set. Skipping href transformation in development.`
        //   );
        //   break handleMicroSite;
        // }

        const rootDomain = normalizeRootDomain(
          process.env.NEXT_PUBLIC_MICRO_SITE_ROOT_DOMAIN
        );

        if (href.startsWith('/')) {
          href = `${rootDomain}${href}`;
        }
      }
    }

    const external = !!href ? isLinkExternal(href) : false;

    const transformedProps: TransformedExtLinkProps = {
      href,
      external,
      ...props,
    };

    if (external) {
      transformedProps.rel = 'noopener noreferrer';
      if (!microSite) {
        transformedProps.target = '_blank';
      }
    }

    transformedProps.className = clsx(
      styles.extLink,
      props.className,
      'ii-ext-link'
    );

    // Remove this property, until used to prevent passing it to DOM elements
    delete transformedProps.microSite;

    return <Component {...transformedProps} />;
  };
}

function ExtLinkBaseComponent({
  className,
  external,
  children,
  href,
  ...props
}: TransformedExtLinkProps) {
  if (!href) return children;

  if (external) {
    return (
      <a {...{ href, ...props }} className={clsx(className)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={clsx(className)} {...props}>
      {children}
    </Link>
  );
}

export const ExtLink = transformExtLinkProps(ExtLinkBaseComponent, false);
export const MicroLink = transformExtLinkProps(ExtLinkBaseComponent, true);

export { willRenderLink, isLinkExternal, extractLinkProps };
export default ExtLink;
