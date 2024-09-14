type ConditionalWrapperProps = Omit<ComponentBaseProps, 'className'> & {
  condition?: boolean;
  wrapper?: (a: React.ReactNode) => React.ReactNode;
  falseWrapper?: (a: React.ReactNode) => React.ReactNode;
};

const ConditionalWrapper = ({
  condition = true,
  children,
  wrapper = (a) => a,
  falseWrapper = (a) => a,
}: ConditionalWrapperProps) => {
  return condition ? wrapper(children) : falseWrapper(children);
};

export default ConditionalWrapper;
