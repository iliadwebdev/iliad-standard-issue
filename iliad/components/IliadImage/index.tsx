// Styles
import styles from './iliad-image.module.scss';
import clsx from 'clsx';

// Next Image
import { ImageProps } from 'next/image';
import Image from 'next/image';

type TransformedIliadImageProps = ImageProps & {};

function transformIliadImageProps(Component) {
  return function IliadImage({ src, alt, className, ...props }: ImageProps) {
    // Generate alt text from src, if not provided
    if (!alt && src) {
      if (src !== null && src !== undefined) {
        const altText =
          (src as any as string)?.split('/')?.pop()?.split('.')?.[0] || 'Image';
        alt = altText;
      }
    }

    if (!alt && process.env.NODE_ENV !== 'production') {
      console.warn(
        '[IliadImage] Image component is missing alt prop. Please provide one for better accessibility.'
      );
    }

    // Add standard classes
    className = clsx(className, 'iliad-Image');

    const transformedProps: TransformedIliadImageProps = {
      className,
      src,
      alt,
      ...props,
    };

    Component.displayName = 'IliadImage';

    return <Component {...transformedProps} />;
  };
}

function IliadImage({ className, ...props }: ImageProps) {
  return <Image className={clsx(className, styles.mainContainer)} {...props} />;
}

export default transformIliadImageProps(IliadImage);
