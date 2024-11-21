// Styles
import styles from './iliad-logo.module.scss';
import { clsx } from 'clsx';

// Components
import ExtLink from '../ExtLink';

type IliadLogoProps = ChildlessComponentBaseProps & {
  height?: number;
  link?: string;
};

const IliadLogo = ({
  link = 'https://iliad.dev/',
  height = 40,
  className,
}: IliadLogoProps) => {
  // TODO: Make this bounce on mobile, so people click
  // on it instead of hovering. Then, once it is clicked
  // once, a second click will take them to the iliad.dev
  // website.
  return (
    <ExtLink href={link}>
      <div
        className={clsx(styles.mainContainer, className)}
        style={
          {
            '--h': `${height}px`,
          } as React.CSSProperties
        }>
        <div className={styles.overflow}>
          <div className={styles.rightMask}>
            <img src='/image/iliad/ILIAD.svg' alt='ILIAD.DEV Logo' />
          </div>
          <div className={styles.leftMask}>
            {/* <img src='/image/iliad/WEB DEV.svg' alt='' /> */}
            <img src='/image/iliad/ODYSSEY_2.svg' alt='START YOUR ODYSSEY' />
          </div>
        </div>
        <div className={styles.logoContainer}>
          <img src='/image/iliad/LOGO.svg' alt='ILIAD.DEV' />
        </div>
      </div>
    </ExtLink>
  );
};

export default IliadLogo;
