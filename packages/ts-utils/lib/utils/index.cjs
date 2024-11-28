"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _createStarExport(obj) { Object.keys(obj) .filter((key) => key !== "default" && key !== "__esModule") .forEach((key) => { if (exports.hasOwnProperty(key)) { return; } Object.defineProperty(exports, key, {enumerable: true, configurable: true, get: () => obj[key]}); }); }var _deepmergets = require('deepmerge-ts');
var _typeguards = require('./typeguards'); _createStarExport(_typeguards);
function mergeDefaults(obj, defaults) {
  return _deepmergets.deepmerge.call(void 0, defaults, obj || {});
}
function isError(error, data = {}) {
  return !!error;
}



exports.isError = isError; exports.mergeDefaults = mergeDefaults;
