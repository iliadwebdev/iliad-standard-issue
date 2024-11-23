"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _deepmergets = require('deepmerge-ts');
function mergeDefaults(obj, defaults) {
  return _deepmergets.deepmerge.call(void 0, defaults, obj || {});
}


exports.mergeDefaults = mergeDefaults;
