"use client";

// Styles
import styles from "./power-button.module.scss";

import clsx from "clsx";

// Mantine
import { useViewportSize, useMergedRef } from "@mantine/hooks";
import { useMantineTheme, Text } from "@mantine/core";

// Components
import { willRenderLink } from "../ExtLink";
import { PBW } from "./wrapper";

// State
import { getColorKey, ColorKeys } from "./state";

// React / Next
import { useCallback, useEffect, useState, useMemo } from "react";

// Hooks / Functions
import {
  getIcon,
  mergeProps,
  calculateColors,
  getVariantFromProps,
  showIcon as cShowIcon,
  showButtonText as cShowButtonText,
  showOrphanedText as cShowOrphanedText,
} from "./utils";

// @ts-ignore
import useRipple from "../../hooks/useRipple";

// Types
import type { PowerButtonProps, StrapiButtonComponentProps } from "./types";

// Default properties - These are opinionated
const defaultButtonProps: any = {
  radius: "100%",
};

const PowerButton = <T extends React.ComponentType<any>>({
  attemptIdSmoothScroll = true,
  mobileClickTimeout = 2000,
  mobileDoubleTap = false,
  variant = "icon-button",
  iconPosition = "right",
  mobileRipples = true,
  icon = "arrowRight",
  injectedComponents,
  color = "ii-brand",
  backgroundColor,
  iconProps = {},
  iconSize = 18,
  useFullWidth,
  fullWidth,
  textProps,
  disabled,
  onClick,
  // Base Props
  className,
  children,
  style,
  ref,
  ...props
}: PowerButtonProps<T>) => {
  const [ripples, clickListenerRef, rc_class] = useRipple(styles.ripple);
  const [clicked, setClicked] = useState(false);

  const { width } = useViewportSize(); // TODO: Would useMediaQuery be better? For some of this stuff, maybe I should make a button context...
  const theme = useMantineTheme();

  // Merge possible refs together
  const mergedRef = useMergedRef(clickListenerRef as any, ref);

  // Generated colors should eventually be stored in a context to avoid recalculating them and polluting the DOM with a bajillion attributes / CSS vars.
  const colors = useMemo(
    () => calculateColors(color, theme, backgroundColor),
    [color, theme, backgroundColor]
  );

  const featureClasses = useMemo(() => {
    let _featureClasses: string[] = [];

    if (mobileRipples) {
      _featureClasses.push(styles.mobileRipples);
    }

    return _featureClasses;
  }, [mobileRipples]);

  // This functionality allows the hover state to be shown on the initial click on mobile.
  useEffect(() => {
    if (!mobileDoubleTap) return;
    let timeout: NodeJS.Timeout;

    if (clicked) {
      timeout = setTimeout(() => {
        setClicked(false);
      }, mobileClickTimeout);
    }

    return () => clearTimeout(timeout);
  }, [clicked]);

  const handleButtonClick = useCallback(
    (event: any) => {
      doubleTap: {
        if (!mobileDoubleTap) break doubleTap;
        if (width > 830) break doubleTap; // Don't do anything if on desktop.
        if (clicked) break doubleTap; // On the second click, don't do anything.

        event.stopPropagation();
        event.preventDefault();
        setClicked(true);
      }

      if (onClick) {
        onClick(event);
      }

      // Once other events have been handled / dispatched, if the button is a link to an ID on the same page and the smooth scroll feature is enabled, attempt to croll to the ID.
      handleIdLink: {
        if (!props?.href?.startsWith("#")) break handleIdLink;
        if (!attemptIdSmoothScroll) break handleIdLink;

        event.preventDefault();

        try {
          const target = document.querySelector(props.href);
          if (!target) {
            console.warn(
              `[Iliad] PowerButton: Could not find element with ID ${props.href}`
            );

            break handleIdLink;
          }

          target.scrollIntoView({
            behavior: "smooth",
          });

          // ILIAD: TODO: Add the id to the URL so that the user can share the link.
        } catch (e) {
          console.error(e);
        }
      }
    },
    [width, mobileDoubleTap]
  );

  const showOrphanedText = useMemo(() => cShowOrphanedText(variant), [variant]);
  const showButtonText = useMemo(() => cShowButtonText(variant), [variant]);
  const showIcon = useMemo(() => cShowIcon(variant), [variant]);
  const hasEvent = useMemo(() => {
    return (willRenderLink(props?.href) || !!onClick) && !disabled;
  }, [onClick, props?.href, disabled]);

  const mergedProps = mergeProps(
    // @ts-ignore
    props,
    {
      disabled,
      color,
    },
    defaultButtonProps
  );

  const mergedStyles = mergeProps<React.CSSProperties>(style, colors.style, {});
  const Icon = useMemo(() => getIcon(icon), [icon]);

  return (
    <PBW
      onClick={handleButtonClick}
      ref={mergedRef}
      // Data attributes - the local prefix should eventually be removed. Naming conflicts can be resolved with a more semantic namespace, if necessary.
      data-local-background={(!!backgroundColor || false).toString()}
      data-local-full-width={fullWidth || useFullWidth}
      data-local-icon-position={iconPosition}
      data-component="buttonMainContainer"
      data-local-has-event={hasEvent}
      data-local-variant={variant}
      // Styling
      style={mergedStyles}
      className={clsx(
        "iliad-PowerButton-root",
        styles.mainContainer,
        ...featureClasses,
        className,
        rc_class
      )}
      // Pass remaining props
      {...mergedProps}
    >
      {injectedComponents && injectedComponents}
      {mobileRipples && (ripples as any)}
      {showButtonText && (
        <div
          data-component="buttonTextContainer"
          className={clsx(
            "iliad-PowerButton-textContainer",
            styles.buttonTextContainer
          )}
        >
          <Text
            component="p"
            {...textProps}
            className={clsx(
              "iliad-PowerButton-text",
              textProps?.className,
              styles.text
            )}
          >
            {children}
          </Text>
        </div>
      )}
      {showIcon && (
        <div
          data-component="iconContainer"
          className={clsx(
            iconPosition === "left" ? styles.iconLeft : styles.iconRight,
            "iliad-PowerButton-iconContainer",
            styles.iconContainer
          )}
        >
          <Icon
            {...iconProps}
            size={iconSize}
            className={clsx(
              "iliad-PowerButton-icon",
              iconProps?.className,
              styles.icon
            )}
          />
        </div>
      )}
      {showOrphanedText && (
        <div
          data-component="orphanedTextContainer"
          className={clsx(
            "iliad-PowerButton-orphanedTextContainer",
            styles.orphanedTextContainer
          )}
        >
          <Text
            {...textProps}
            className={clsx(
              "iliad-PowerButton-orphanedText",
              "iliad-PowerButton-text",
              textProps?.className,
              styles.orphanedText,
              styles.text
            )}
          >
            {children}
          </Text>
        </div>
      )}
    </PBW>
  );
};

const UnstyledPowerButton = ({
  // Base Props
  className,
  children,
  ...props
}: PowerButtonProps) => {
  return (
    <PowerButton {...props} className={clsx(styles.unstyled, className)}>
      {children}
    </PowerButton>
  );
};

export { PowerButton, UnstyledPowerButton };
export default PowerButton;
