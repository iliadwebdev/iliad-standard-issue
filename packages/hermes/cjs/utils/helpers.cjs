"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/helpers.ts
var helpers_exports = {};
__export(helpers_exports, {
  getFormattedName: () => getFormattedName,
  getTimestamp: () => getTimestamp,
  padPrefix: () => padPrefix
});
module.exports = __toCommonJS(helpers_exports);
function getTimestamp(showDate = false) {
  var date = /* @__PURE__ */ new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;
  var str = date.getFullYear() + "-" + month + "-" + day + "_" + hour + ":" + min + ":" + sec;
  return (showDate ? str : str?.split("_")[1]) || "00:00:00";
}
function getFormattedName(inputString, options = {}) {
  let {
    targetLength = 10,
    padWith = " ",
    padLeft = false,
    truncate = true,
    truncateWith = "..."
  } = options;
  if (inputString.length < targetLength) {
    while (inputString.length < targetLength) {
      inputString = padLeft ? padWith + inputString : inputString + padWith;
    }
  }
  if (truncate && inputString.length > targetLength) {
    inputString = inputString.slice(0, targetLength - 3) + truncateWith;
  }
  return inputString;
}
function padPrefix(prefix) {
  return prefix === "" ? " " : `  ${prefix}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFormattedName,
  getTimestamp,
  padPrefix
});
