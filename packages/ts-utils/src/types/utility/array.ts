export type ValueOf<T> = T extends readonly (infer U)[] ? U : never;
