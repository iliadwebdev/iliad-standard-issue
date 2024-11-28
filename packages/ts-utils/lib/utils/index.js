import { deepmerge } from "deepmerge-ts";
export * from "./typeguards";
function mergeDefaults(obj, defaults) {
  return deepmerge(defaults, obj || {});
}
function isError(error, data = {}) {
  return !!error;
}
export {
  isError,
  mergeDefaults
};
