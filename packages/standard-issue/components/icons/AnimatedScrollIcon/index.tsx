// Styles
import styles from "./animated-scroll-icon.module.scss";
import clsx from "clsx";

// Types
import { IliadIconProps } from "../types";

type ScrollIconProps = IliadIconProps<{
  animated?: boolean;
}>;

const ScrollIcon = ({
  color = "#00ace0",
  size = 128,
  animated,
  // Base Props
  className,
  style,
  ...props
}: ScrollIconProps) => {
  const _size = size + 10;
  const classNames = [styles.scrollIcon, className];

  if (animated) {
    classNames.push(styles.animated);
  }

  const _style = {
    ...style,
    "--si-size": `${size}px`,
    "--si-color": color,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(classNames)}
      viewBox="0 0 128 128"
      style={_style}
      height={_size}
      width={_size}
      fill="none"
      {...props}
    >
      <rect
        x="40.5"
        y="20.5"
        rx="23.5"
        width="47"
        height="87"
        stroke={color}
        strokeWidth="5"
      />
      <circle className={styles.circle} cx="64" cy="44" r="16" fill={color} />
    </svg>
  );
};

const AnimatedScrollIcon = (props: Omit<ScrollIconProps, "animated">) => (
  <ScrollIcon {...props} animated={true} />
);

export default AnimatedScrollIcon;
export { AnimatedScrollIcon, ScrollIcon };
