const { startAtRoot } = require("./start-at-root");

const path = require("path");
const fs = require("fs");

(() =>
  startAtRoot((rootPath, pkgJson) => {
    console.log(`Post-Install script run from package [${pkgJson.name}]`);
  }))();
