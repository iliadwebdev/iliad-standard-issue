"use strict";Object.defineProperty(exports, "__esModule", {value: true});require('../chunk-PKBMQBKP.js');
async function downloadContentTypes(hermes, { outDir }) {
  console.log("Downloading content types");
  return await hermes.axios.get("/content-types", void 0);
}


exports.downloadContentTypes = downloadContentTypes;
