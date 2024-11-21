declare function assignRef(ref: React.Ref<any> | null, value: any): void;
declare function mergeRefs(...refs: (React.Ref<any> | null)[]): (node: any) => void;
declare function useMergedRef<T>(...refs: (React.Ref<T> | null)[]): React.RefCallback<T>;

export { assignRef, useMergedRef as default, mergeRefs, useMergedRef };
