// Types
import type { ExtLinkProps } from "../../";

type ExtractableProps = ExtLinkProps & Record<string, any>;

export function notIliad(href: string | undefined): boolean {
  if (!href) return false;
  return !href.includes("iliad.dev");
}

export function isLinkExternal(href: string | undefined): boolean {
  if (!href) return false;
  return [
    href.startsWith("https://"),
    href.startsWith("http://"),
    href.includes("mailto:"),
    href.startsWith("//"),
  ].some(Boolean);
}

export function willRenderLink(href: string | undefined | null) {
  return !!href;
}

export function extractLinkProps({
  legacyBehavior,
  onMouseEnter,
  onTouchStart,
  passHref,
  prefetch,
  replace,
  onClick,
  shallow,
  locale,
  scroll,
  href,
  as,
}: ExtractableProps) {
  return {
    legacyBehavior,
    onMouseEnter,
    onTouchStart,
    passHref,
    prefetch,
    replace,
    onClick,
    shallow,
    locale,
    scroll,
    href,
    as,
  };
}

/**
 * Normalizes a root domain by ensuring it includes a protocol and removing any trailing slashes.
 *
 * @param rootDomain - The root domain to normalize.
 * @returns The normalized root domain with protocol and without trailing slash.
 */
export function normalizeRootDomain(rootDomain: string): string {
  // Prepend protocol if it's missing to help parsing
  if (!/^https?:\/\//i.test(rootDomain)) {
    rootDomain = "https://" + rootDomain;
  }

  let url = new URL(rootDomain);
  let rootDomainUrl = url.origin;

  // Remove trailing slash
  return rootDomainUrl.replace(/\/$/, "");
}
