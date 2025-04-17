"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _createStarExport(obj) { Object.keys(obj) .filter((key) => key !== "default" && key !== "__esModule") .forEach((key) => { if (exports.hasOwnProperty(key)) { return; } Object.defineProperty(exports, key, {enumerable: true, configurable: true, get: () => obj[key]}); }); }require('@iliad.dev/primitive-extensions');
var _deepmergets = require('deepmerge-ts');
var _typeguards = require('./typeguards'); _createStarExport(_typeguards);
function mergeDefaults(obj, defaults) {
  return _deepmergets.deepmerge.call(void 0, defaults, obj || {});
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





exports.isError = isError; exports.mergeDefaults = mergeDefaults; exports.preferentialArrayMerge = preferentialArrayMerge; exports.uniqueArrayMerge = uniqueArrayMerge;
