// Styles
import styles from "./iliad-image.module.scss";
import clsx from "clsx";

// Components
import { Image, ImageProps as MantineImageProps } from "@mantine/core";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

// Types
export type IliadImageProps = Omit<NextImageProps, "alt"> & {
  disablePlaceholder?: boolean;
  placeholderDataUrl?: string;
  alt?: string;
};

// & MantinePossible;

type MantinePossible = XOR<
  { mantineImage: true } & MantineImageProps,
  {
    mantineImage?: false;
  }
>;

type StrapiMediaAssetFormat = {
  height?: number;
  width?: number;
  url: string;
};

interface BaseStrapiMediaAsset {
  alternativeText?: string;
  placeholder?: string;
  caption?: string;
  height?: number;
  width?: number;
  mime?: string;
  // id: string;
  url: string;
}

const PRODUCTION = process.env.NODE_ENV === "production";
const CLOUDINARY_QUALITY = "best";

interface StrapiMediaAsset extends BaseStrapiMediaAsset {
  formats?: Record<string, StrapiMediaAssetFormat>;
}

// StrapiImageProps
export type StrapiImageProps = Partial<Omit<IliadImageProps, "src">> & {
  format?: "thumbnail" | "medium" | "large" | "small" | "original";
} & XOR<
    { strapiMediaAsset: StrapiMediaAsset },
    { mediaAsset: BaseStrapiMediaAsset }
  >;

// Helper Functions
function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

function removeStrapiProps<T extends object>(
  props: T
): Omit<T, keyof StrapiPropsToRemove> {
  const propsToOmit: (keyof StrapiPropsToRemove)[] = [
    "provider_metadata",
    "folderPath",
    "data-nimg",
    "updatedAt",
    "createdAt",
    "provider",
    "formats",
    "mime",
    "hash",
    "url",
    "ext",
  ];

  // @ts-ignore
  return omit(props, propsToOmit);
}

type StrapiPropsToRemove = {
  provider_metadata?: any;
  "data-nimg"?: any;
  folderPath?: any;
  updatedAt?: any;
  createdAt?: any;
  provider?: any;
  formats?: any;
  mime?: any;
  hash?: any;
  url?: any;
  ext?: any;
};

function coerceMediaAsset(
  mediaAsset?: BaseStrapiMediaAsset,
  strapiMediaAsset?: StrapiMediaAsset
): StrapiMediaAsset | undefined {
  if (strapiMediaAsset) {
    return strapiMediaAsset;
  } else if (mediaAsset) {
    return mediaAsset as StrapiMediaAsset;
  }
  return undefined;
}

// APIResponseData<"plugin::upload.file"> - NOTE: For future reference

function isStaticImport(src: string | StaticImport): src is StaticImport {
  return typeof src === "object";
}

function transformSource(src: string): [string, boolean] {
  if (!src.includes("res.cloudinary.com")) return [src, false];

  let [url, _image] = src.split("/upload/");
  let [image] = _image.split(".");

  return [src, true];
  // return [`${url}/upload/${image}.jpg`, true];

  // https://res.cloudinary.com/dat9egjyq/image/upload/v1718503352/Tomorrow_Project_Aliquippa_Mural_Installation_with_Guy_Ruff_III_8_115cfbb0e3.jpg

  // return [
  //   `${url}/upload/q_auto:${CLOUDINARY_QUALITY},f_auto/${image}.webp`,
  //   true,
  // ];
}

function transformIliadImageProps(
  Component: React.ComponentType<IliadImageProps>
) {
  return function IliadImage({
    src,
    alt,
    quality,
    className,
    placeholderDataUrl,
    draggable = false,
    ...props
  }: IliadImageProps) {
    // Generate alt text from src, if not provided
    if (!alt && src && typeof src === "string") {
      alt = src.split("/").pop()?.split(".")[0] || "Image";
    }

    if (!alt && !PRODUCTION) {
      console.warn(
        "[IliadImage] Image component is missing alt prop. Please provide one for better accessibility."
      );
    }

    // Add standard classes
    className = clsx(className, "iliad-Image");

    // Remove Strapi props
    const sanitizedProps = removeStrapiProps(props);

    // Adjust src
    adjust: {
      if (isStaticImport(src)) break adjust;

      let [tSrc, isCloudinary] = transformSource(src);
      src = tSrc;

      if (!isCloudinary) break adjust;
      quality = 100; // If it is a cloudinary image, let cloudinary handle compression
    }

    const transformedProps: IliadImageProps = {
      draggable,
      className,
      src,
      alt,
      ...sanitizedProps,
    };

    if (placeholderDataUrl) {
      transformedProps.blurDataURL = placeholderDataUrl;
      transformedProps.placeholder = "blur";
    }

    return <Component {...transformedProps} />;
  };
}

function extractIliadProps(
  Component: React.ComponentType<FinalIliadImageProps>
) {
  return function StrapiImage({
    format = "original",
    placeholderDataUrl,
    disablePlaceholder,
    strapiMediaAsset,
    mediaAsset,
    ...props
  }: StrapiImageProps) {
    let media = coerceMediaAsset(mediaAsset, strapiMediaAsset);

    if (!media) {
      console.warn("[IliadImage] No media asset provided.");
      return null;
    }

    if (format !== "original" && media.formats) {
      const specifiedFormat = media.formats[format];
      if (specifiedFormat) {
        media = {
          ...media,
          ...specifiedFormat,
        };
      } else {
        console.warn(
          `[IliadImage] Format "${format}" not found for image ${media.url}. Using original image.`
        );
      }
    }

    const extractedProps: Partial<IliadImageProps> = {
      alt: props.alt || media.caption || media.alternativeText,
      height: props.height || media.height,
      width: props.width || media.width,
      src: media.url,
    };

    if (media.placeholder || placeholderDataUrl) {
      extractedProps.placeholderDataUrl =
        placeholderDataUrl || media.placeholder;
    }

    // ILIAD: TODO: This is really stupid. I need to re-write this component from the ground-up.
    if (disablePlaceholder) {
      extractedProps.placeholderDataUrl = undefined;
      extractedProps.placeholder = undefined;

      props.blurDataURL = undefined;
      props.placeholder = undefined;
    }

    // @ts-ignore
    return <Component {...props} {...extractedProps} />;
  };
}

type FinalIliadImageProps = IliadImageProps & {
  alt: NextImageProps["alt"];
};

const IliadImageComponent = ({ className, ...props }: FinalIliadImageProps) => {
  const _props: Partial<FinalIliadImageProps> = {};

  // Silly I have to do this
  // if (props.placeholder) {
  //   _props.blurDataURL = props.placeholder;
  //   _props.placeholder = "blur";
  // }

  return (
    <Image
      className={clsx(className, styles.mainContainer)}
      component={NextImage}
      {...props}
      {..._props}
    />
  );
};

export type UnknownImageProps = XOR<IliadImageProps, StrapiImageProps>;

// Transformations
const IliadImage = transformIliadImageProps(IliadImageComponent);
const StrapiImage = extractIliadProps(IliadImage);

// Exports
export { IliadImage, StrapiImage };
export default IliadImage;
