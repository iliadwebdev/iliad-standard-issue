'use client';

// Styles
import styles from './power-button.module.scss';
import clsx from 'clsx';

// Mantine
import { useMantineTheme, Text, Box } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

// Components
import ConditionalWrapper from '../ConditionalWrapper';
import ExtLink, { willRenderLink } from '../ExtLink';

// React / Next
import { useCallback, useEffect, useState } from 'react';

// Icons
import { FaArrowRight } from 'react-icons/fa';

// Hooks / Functions
import {
  showIcon,
  getColors,
  showButtonText,
  showOrphanedText,
} from './utils/functions/helperFunctions';

// @ts-ignore
import useRipple from '../../utils/hooks/useRipple';

// Types
import type { ButtonProps, MantineColor, TextProps } from '@mantine/core';
import { IconType, IconBaseProps } from 'react-icons';
import type { ExtLinkProps } from '../ExtLink';

export type Variants = (
  | 'icon-button'
  | 'text-button'
  | 'icon-only'
  | 'icon-text'
) & {};

export type PowerButtonProps = ComponentBaseProps &
  ExtLinkProps &
  ButtonProps & {
    iconPosition?: ('left' | 'right') & {};
    mobileClickTimeout?: number;
    mobileDoubleTap?: boolean;
    iconProps?: IconBaseProps;
    backgroundColor?: boolean | string;
    mobileRipples?: boolean;
    useFullWidth?: boolean;
    textProps?: TextProps;
    color?: MantineColor;
    variant?: Variants;
    iconSize?: number;
    icon?: IconType;
  };

type PBWProps = Partial<PowerButtonProps & Record<string, any>>;

// POWER BUTTON WRAPPER
const PBW = ({ children, ...props }: PBWProps) => {
  return (
    <ConditionalWrapper
      condition={willRenderLink(props?.href)}
      wrapper={(_children) => {
        return (
          <Box component={ExtLink} {...props}>
            {_children}
          </Box>
        );
      }}
      falseWrapper={(_children) => {
        return (
          <Box component='button' {...(props as any)}>
            {_children}
          </Box>
        );
      }}>
      {children}
    </ConditionalWrapper>
  );
};

const PowerButton = ({
  mobileClickTimeout = 2000,
  mobileDoubleTap = false,
  variant = 'icon-button',
  iconPosition = 'right',
  mobileRipples = true,
  useFullWidth = false,
  icon = FaArrowRight,
  color = 'll-brand',
  backgroundColor,
  iconProps = {},
  iconSize = 18,
  className,
  textProps,
  children,
  onClick,
  ...props
}: PowerButtonProps) => {
  const [ripples, clickListenerRef, rc_class] = useRipple(styles.ripple);
  const [clicked, setClicked] = useState(false);

  const { width } = useViewportSize();
  const theme = useMantineTheme();

  const Icon = icon;

  const colors = getColors(color, theme);

  if (typeof backgroundColor === 'string') {
    colors.style = {
      ...colors.style,
      ...getColors(backgroundColor, theme, 'background-color').style,
    };
  }

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
    },
    [width, mobileDoubleTap]
  );

  // const hasClickEvent = !!(onClick || props?.href) && !props?.disabled;

  return (
    <PBW
      color={color}
      radius={'100%'}
      {...props}
      onClick={handleButtonClick}
      className={clsx(styles.mainContainer, className, rc_class)}
      data-local-background={(!!backgroundColor || false).toString()}
      data-local-icon-position={iconPosition}
      data-local-full-width={useFullWidth}
      data-component='buttonMainContainer'
      ref={clickListenerRef as any}
      data-local-variant={variant}
      style={colors.style}>
      {mobileRipples && (ripples as any)}
      {showButtonText(variant) && (
        <div
          className={styles.buttonTextContainer}
          data-component='buttonTextContainer'>
          <Text component='p' {...textProps} className={styles.text}>
            {children}
          </Text>
        </div>
      )}
      {showIcon(variant) && (
        <div data-component='iconContainer' className={styles.iconContainer}>
          <Icon
            size={iconSize}
            {...iconProps}
            className={clsx(styles.icon, iconProps?.className)}
          />
        </div>
      )}
      {showOrphanedText(variant) && (
        <div
          className={styles.orphanedTextContainer}
          data-component='orphanedTextContainer'>
          <Text className={styles.text} {...textProps}>
            {children}
          </Text>
        </div>
      )}
    </PBW>
  );
};

export default PowerButton;
