import React, { ReactNode, ReactElement } from "react";

// Types to extract falsy and not falsy parts of a type
type Falsy = false | 0 | "" | null | undefined;
type FalsyPart<T> = Extract<T, Falsy>;
type NotFalsy<T> = Exclude<T, Falsy>;

type ConditionalWrapperProps<T> = Omit<ComponentBaseProps, "className"> & {
  wrapper?: (
    children: ReactNode,
    typedCondition: NotFalsy<T>
  ) => ReactElement | null;
  falseWrapper?: (
    children: ReactNode,
    typedCondition: FalsyPart<T>
  ) => ReactElement | null;
  children: ReactNode;
  condition: T;
};

const wrapperCallback = <T,>(a: ReactNode, c: T) => <>{a}</>;

/**
 * A component that conditionally wraps its children with a specified wrapper.
 * Callbacks return a properly typed version of the condition.
 *
 * @template T - The type of the condition.
 * @param {ConditionalWrapperProps<T>} props - The props for the ConditionalWrapper component.
 * @param {Function} [props.falseWrapper=wrapperCallback] - The wrapper function to use when the condition is falsy.
 * @param {Function} [props.wrapper=wrapperCallback] - The wrapper function to use when the condition is truthy.
 * @param {T | FalsyPart<T>} props.condition - The condition to evaluate.
 * @param {React.ReactNode} props.children - The children to be wrapped.
 * @returns {ReactElement | null} The wrapped children if the condition is truthy, otherwise the falseWrapper wrapped children, or null if the content is undefined.
 */
const ConditionalWrapper = <T,>({
  falseWrapper = wrapperCallback,
  wrapper = wrapperCallback,
  condition,
  children,
}: ConditionalWrapperProps<T>): ReactElement | null => {
  const content = !!condition
    ? wrapper(children, condition as NotFalsy<T>)
    : falseWrapper(children, condition as FalsyPart<T>);

  // Ensure the content is a valid JSX element or null
  return content !== undefined ? content : null;
};

export default ConditionalWrapper;
