const path = require("path");

module.exports.startAtRoot = function startAtRoot(callback) {
  const modulePath = path.resolve(process.cwd());
  const rootPath = modulePath.split("node_modules")[0];
  const pkgJson = require(path.resolve(modulePath, "./package.json"));

  if (!rootPath || !pkgJson) {
    throw new Error(`Unable to find rootPath or pkgJson!`);
  }

  return callback(rootPath, modulePath, pkgJson).then(() => {
    return "run";
  });
};
