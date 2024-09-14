// Styles
import styles from './clamp.module.scss';
import { clsx } from 'clsx';

// Mantine
import { BoxComponentProps } from '@mantine/core';
import { Box } from '@mantine/core';

type ClampSize = ('full' | 'nav' | 'standard' | 'small' | 'text') & {};
type ClampWidth = (string & {}) | (number & {});
type Padding = ('left' | 'right' | 'both') & {};
type ClampType = ('margin' | 'padding') & {};

type ClampProps = ComponentBaseProps &
  BoxComponentProps & {
    width?: ClampWidth | ClampSize;
    margin?: string | number;
    padding?: Padding;
    type?: ClampType;
    component?: any;
  } & {
    [key: string]: any;
  };

type TransformedClampProps = ComponentBaseProps & {
  padding?: Omit<Padding, 'both'> | 'left,right';
  type: ClampType;
  margin: string;
  width: string;
};

function normalizeNumberInput(n: ClampWidth): string {
  // Second clause is logically unnecessary, but satisfies TypeScript
  if (!isNaN(n as number) || typeof n === 'number') {
    return `${n}px`;
  }

  return n;
}

function normalizeWidth(width: ClampWidth | ClampSize): string {
  const sizes = {
    small: 'var(--clamp-small-width)',
    standard: 'var(--standard-width)',
    full: 'var(--clamp-full-width)',
    text: 'var(--clamp-text-width)',
    nav: 'var(--nav-width)',
  };

  if (Object.keys(sizes).includes(width as string)) {
    return sizes[width as ClampSize];
  }

  return normalizeNumberInput(width as ClampWidth);
}

function transformClampProps(Component: any) {
  return function Clamp({
    margin = `var(--normalized-margin)`,
    width = `var(--normalized-width)`,
    padding = 'both',
    type = 'margin',
    className,
    ...props
  }: ClampProps) {
    width = normalizeWidth(width);
    margin = normalizeNumberInput(margin);
    let _padding = padding === 'both' ? 'left,right' : padding;

    if (type === 'padding') {
      props['data-local-padding'] = _padding;
    }

    // Add standard classes
    className = clsx(className, 'iliad-Clamp');

    const transformedProps: TransformedClampProps = {
      padding: _padding,
      className,
      margin,
      width,
      type,
      ...props,
    };

    Component.displayName = 'Clamp';

    return <Component {...transformedProps} />;
  };
}

function Clamp({
  className,
  children,
  padding,
  margin,
  width,
  type,
  ...props
}: TransformedClampProps) {
  return (
    <Box
      className={clsx(styles.mainContainer, className)}
      data-local-type={type}
      style={{
        '--w': width,
        '--m': margin,
      }}
      {...props}>
      {children}
    </Box>
  );
}

const TransformedClamp = transformClampProps(Clamp);

export default TransformedClamp;
