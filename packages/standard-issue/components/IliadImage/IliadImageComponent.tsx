"use server";

// Styles
import styles from "./iliad-image.module.scss";
import clsx from "clsx";

// Components
import { Image } from "@mantine/core";
import NextImage from "next/image";

// Types
import type { IliadImageProps } from "./index";

function IliadImageComponent({ className, ...props }: IliadImageProps) {
  // ILIAD: TODO: NOTE: Fix this train wreck
  return (
    // @ts-ignore
    <Image
      className={clsx(className, styles.mainContainer)}
      component={NextImage}
      {...props}
    />
  );
}

export default IliadImageComponent;
export { IliadImageComponent };
