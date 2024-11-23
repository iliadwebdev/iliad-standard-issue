import { deepmerge } from "deepmerge-ts";
function mergeDefaults(obj, defaults) {
  return deepmerge(defaults, obj || {});
}
export {
  mergeDefaults
};
