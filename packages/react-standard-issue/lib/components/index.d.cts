import * as react_jsx_runtime from 'react/jsx-runtime';
import { BoxComponentProps } from '@mantine/core';

type ClampSize = ("full" | "nav" | "standard" | "small" | "text") & {};
type ClampWidth = (string & {}) | (number & {});
type Padding = ("left" | "right" | "both") & {};
type ClampType = ("margin" | "padding") & {};
type ClampProps = ComponentBaseProps & BoxComponentProps & {
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
type TransformedClampProps = ComponentBaseProps & BoxComponentProps & {
    component?: React.ElementType<any, keyof JSX.IntrinsicElements>;
    padding?: Omit<Padding, "both"> | "left,right";
    simulated?: boolean;
    type: ClampType;
    margin: string;
    width: string;
};
declare const TransformedClamp: ({ margin, width, simulated, padding, type, className, section, ...props }: ClampProps) => react_jsx_runtime.JSX.Element;
type SectionProps = {} & XOR<{
    literal?: boolean;
}, {
    fullWidth?: boolean;
}>;
declare const Section: ({ fullWidth, literal, className, ...props }: ClampProps & SectionProps) => react_jsx_runtime.JSX.Element;

export { TransformedClamp as Clamp, type ClampProps, Section, type TransformedClampProps };
