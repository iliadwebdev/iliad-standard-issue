import styles from "./typography.module.scss";
import clsx from "clsx";

import {
  Text as M_Text,
  Title as M_Title,
  TextProps,
  TitleProps,
} from "@mantine/core";

const Text = ({ className, ...props }: TextProps) => {
  return (
    <M_Text
      className={clsx(className, "iliad-Text-root", styles.text)}
      {...props}
    />
  );
};

const Title = ({ className, ...props }) => {
  return (
    <M_Title
      className={clsx(className, "iliad-Title-root", styles.title)}
      {...props}
    />
  );
};

export { Text, Title };
