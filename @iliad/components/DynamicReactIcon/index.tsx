'use client';

import { DOMAttributes } from 'react';

export type IReactIcon = string;

import loadable from '@loadable/component';
import { IconType } from 'react-icons';

const iconComponents = {
  Ai: () => import('react-icons/ai'),
  Bs: () => import('react-icons/bs'),
  Bi: () => import('react-icons/bi'),
  Ci: () => import('react-icons/ci'),
  Di: () => import('react-icons/di'),
  Fi: () => import('react-icons/fi'),
  Fc: () => import('react-icons/fc'),
  Fa: () => import('react-icons/fa6'),
  Gi: () => import('react-icons/gi'),
  Go: () => import('react-icons/go'),
  Gr: () => import('react-icons/gr'),
  Hi: () => import('react-icons/hi2'),
  Im: () => import('react-icons/im'),
  Lia: () => import('react-icons/lia'),
  Io: () => import('react-icons/io5'),
  Lu: () => import('react-icons/lu'),
  Md: () => import('react-icons/md'),
  Pi: () => import('react-icons/pi'),
  Rx: () => import('react-icons/rx'),
  Ri: () => import('react-icons/ri'),
  Si: () => import('react-icons/si'),
  Sl: () => import('react-icons/sl'),
  Tb: () => import('react-icons/tb'),
  Tfi: () => import('react-icons/tfi'),
  Ti: () => import('react-icons/ti'),
  Vsc: () => import('react-icons/vsc'),
  Wi: () => import('react-icons/wi'),
  Cg: () => import('react-icons/cg'),
} as unknown as { [x: string]: () => Promise<{ [key: string]: IconType }> };

export interface IDynamicReactIcon extends DOMAttributes<SVGElement> {
  name: IReactIcon;
  size?: number;
}

export type DynamicReactIconProps = IDynamicReactIcon & ComponentBaseProps;

const DynamicReactIcon = ({ name, ...rest }: DynamicReactIconProps) => {
  const lib = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')[0];
  const iconComponent = iconComponents[lib];

  if (!iconComponent) return <></>;

  const DynamicIcon = loadable(iconComponent, {
    resolveComponent: (el) => el[name],
  }) as IconType;

  return <DynamicIcon {...rest} />;
};

export default DynamicReactIcon;
