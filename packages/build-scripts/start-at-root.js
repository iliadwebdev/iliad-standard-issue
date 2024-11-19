const path = require("path");

export function startAtRoot(callback) {
  const rootPath = path.resolve(process.cwd());
  const pkgJson = require(path.resolve(rootPath, "./package.json"));

  if (!rootPath || !pkgJson) {
    throw new Error(`Unable to find rootPath or pkgJson!`);
  }

  return callback(rootPath, pkgJson);
}
