export {};
declare global {
  type DomElementProps<
    T extends
      | keyof JSX.IntrinsicElements
      | undefined = keyof JSX.IntrinsicElements,
  > = T extends undefined
    ? {} // No extra props if T is undefined
    : // @ts-ignore
      JSX.IntrinsicElements[T]; // Extra props if T is defined

  type OptDom = (keyof JSX.IntrinsicElements & {}) | undefined;

  type ComponentBaseProps<D extends OptDom = undefined> = Partial<{
    style: React.CSSProperties;
    children: React.ReactNode;
    ref: React.Ref<any>;
    className: string;
    // id: string;
  }> &
    DomElementProps<D>;

  type ChildlessComponentBaseProps<D extends OptDom = undefined> = Omit<
    ComponentBaseProps<D>,
    "children"
  >;
}
