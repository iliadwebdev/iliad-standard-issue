import { XOR } from "@iliad.dev/ts-utils";

// Styles
import styles from "./clamp.module.scss";
import { clsx } from "clsx";

// Mantine
import { BoxComponentProps } from "@mantine/core";
import { Box } from "@mantine/core";

type ClampSize = ("full" | "nav" | "standard" | "small" | "text") & {};
type ClampWidth = (string & {}) | (number & {});
type Padding = ("left" | "right" | "both") & {};
type ClampType = ("margin" | "padding") & {};

export type ClampProps = ComponentBaseProps &
  BoxComponentProps & {
    component?: React.ElementType<any, keyof JSX.IntrinsicElements>;
    width?: ClampWidth | ClampSize;
    margin?: string | number;
    simulated?: boolean;
    section?: boolean;
    padding?: Padding;
    type?: ClampType;
  } & {
    [key: string]: any;
  };

export type TransformedClampProps = ComponentBaseProps &
  BoxComponentProps & {
    component?: React.ElementType<any, keyof JSX.IntrinsicElements>;
    padding?: Omit<Padding, "both"> | "left,right";
    simulated?: boolean;
    type: ClampType;
    margin: string;
    width: string;
  };

function normalizeNumberInput(n: ClampWidth): string {
  // Second clause is logically unnecessary, but satisfies TypeScript
  if (!isNaN(n as number) || typeof n === "number") {
    return `${n}px`;
  }

  return n;
}

function normalizeWidth(width: ClampWidth | ClampSize): string {
  const sizes = {
    small: "var(--clamp-small-width)",
    standard: "var(--standard-width)",
    full: "var(--clamp-full-width)",
    text: "var(--clamp-text-width)",
    nav: "var(--nav-width)",
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
    simulated = false,
    padding = "both",
    type = "margin",
    className,
    section,
    ...props
  }: ClampProps) {
    width = normalizeWidth(width);
    margin = normalizeNumberInput(margin);

    let _padding = padding === "both" ? "left,right" : padding;

    if (type === "padding") {
      props["data-local-padding"] = _padding;
    }

    // Add standard classes
    const classNames = [className, "iliad-Clamp-root"];

    if (simulated) {
      classNames.push("iliad-Clamp-simulated", styles.simulated);
    }

    className = clsx(classNames);

    const transformedProps: TransformedClampProps = {
      padding: _padding,
      className,
      margin,
      width,
      type,
      ...props,
    };

    if (section && !props["component"]) {
      transformedProps.component = "section";
    }

    Component.displayName = "Clamp";

    return <Component {...transformedProps} />;
  };
}

function Clamp({
  component,
  className,
  children,
  padding,
  margin,
  width,
  type,
  ...props
}: TransformedClampProps) {
  return (
    // @ts-ignore
    <Box
      className={clsx(styles.mainContainer, className)}
      data-local-type={type}
      component={"section"}
      style={{
        "--w": width,
        "--m": margin,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

const TransformedClamp = transformClampProps(Clamp);

type SectionProps = {} & XOR<{ literal?: boolean }, { fullWidth?: boolean }>;
const Section = ({
  fullWidth,
  literal,
  className,
  ...props
}: ClampProps & SectionProps) => {
  if (literal) {
    return (
      <section className={clsx(className, "iliad-Section-root")} {...props} />
    );
  }

  if (fullWidth) {
    return (
      <TransformedClamp
        className={clsx(className, "iliad-Section-root")}
        width="100%"
        margin={0}
        w="100%"
        m={0}
        {...props}
        section
      />
    );
  }

  return (
    <TransformedClamp
      className={clsx(className, "iliad-Section-root")}
      {...props}
      section
    />
  );
};

export { TransformedClamp as Clamp, Section };
export default TransformedClamp;
