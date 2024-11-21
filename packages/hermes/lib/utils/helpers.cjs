"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }require('../chunk-ETV4XYOV.cjs');
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
  return (showDate ? str : _optionalChain([str, 'optionalAccess', _ => _.split, 'call', _2 => _2("_"), 'access', _3 => _3[1]])) || "00:00:00";
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




exports.getFormattedName = getFormattedName; exports.getTimestamp = getTimestamp; exports.padPrefix = padPrefix;
