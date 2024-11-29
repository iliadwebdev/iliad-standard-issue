import "@iliad.dev/primitive-extensions";
import { deepmerge } from "deepmerge-ts";
export * from "./typeguards";
function mergeDefaults(obj, defaults) {
  return deepmerge(defaults, obj || {});
}
function isError(error, data = {}) {
  return !!error;
}
function uniqueArrayMerge(target, source, options) {
  let values = [];
  for (let i = 0; i < target.length; i++) {
    if (!source.includes(target[i])) {
      values.push(target[i]);
    }
  }
  for (let i = 0; i < source.length; i++) {
    if (!target.includes(source[i])) {
      values.push(source[i]);
    }
  }
  return values;
}
function preferentialArrayMerge(prefer = "target", unique = false) {
  return (target, source, options) => {
    let penultimate = [];
    findPenultimate: {
      if (!target.length && !source.length) {
        penultimate = target;
        break findPenultimate;
      }
      if (!target.length) {
        penultimate = source;
        break findPenultimate;
      }
      if (!source.length) {
        penultimate = target;
        break findPenultimate;
      }
      penultimate = prefer === "target" ? target : source;
    }
    return unique ? Array.unique(penultimate) : penultimate;
  };
}
export {
  isError,
  mergeDefaults,
  preferentialArrayMerge,
  uniqueArrayMerge
};
