type ComponentBaseProps = Partial<{
  style: React.CSSProperties;
  children: React.ReactNode;
  className: string;
  ref: React.Ref<any>;
}>;

type ChildlessComponentBaseProps = Omit<ComponentBaseProps, 'children'>;
