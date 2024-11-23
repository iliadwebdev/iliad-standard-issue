/**
 * Merges the provided object with the default values, ensuring that all fields
 * from the defaults are present in the resulting object.
 * Tip: If you want the resultant object to maintain optional fields, explicitely type the input type as `| undefined`.
 *
 * @template T - The type of the object to merge.
 * @param {T} obj - The object to merge with the defaults.
 * @param {Recursive_OptionalFieldsOf<T>} defaults - The default values to merge into the object.
 * @returns {Recursive_Required<T>} - The resulting object with all default fields included.
 */
declare function mergeDefaults<T>(obj: T | undefined, defaults: Recursive_OptionalFieldsOf<T>): Recursive_Required<T>;
type SyncOptions = {
    throwOnError?: boolean;
    timeout?: number;
};
declare function sync<Args extends any[], R>(fn: (...args: Args) => Promise<R>, options?: SyncOptions): (...args: Args) => StandardResponse<R>;

export { mergeDefaults, sync };
