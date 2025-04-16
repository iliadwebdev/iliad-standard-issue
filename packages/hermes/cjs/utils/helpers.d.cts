declare function getTimestamp(showDate?: boolean): string;
interface GetFormattedNameOptions {
    targetLength?: number;
    padWith?: string;
    padLeft?: boolean;
    truncate?: boolean;
    truncateWith?: string;
}
declare function getFormattedName(inputString: string, options?: GetFormattedNameOptions): string;
declare function padPrefix(prefix: string): string;

export { getFormattedName, getTimestamp, padPrefix };
