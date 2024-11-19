const path = require("path");
const fs = require("fs");

function iterateVersion(v) {
  let [major, minor, patch] = v.split(".");
  patch++;
  return [major, minor, patch].map((x) => parseInt(x));
}

function writePackageJson(pkg, pkgPath) {
  const [major, minor, patch] = iterateVersion(pkg.version);
  pkg.version = `${major}.${minor}.${patch}`;

  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  } catch (error) {
    console.error(`Failed to write package.json: ${error}`);
    return;
  }

  console.log(`Successfully iterated ${pkg.name} to ${pkg.version}`);
}

(function () {
  const root = path.resolve(process.cwd());
  const pkgPath = path.resolve(root, "./package.json");
  const pkg = require(pkgPath);

  if (!pkg) {
    console.error(`Could not locate package at ${pkgPath}`);
    return;
  }

  writePackageJson(pkg, pkgPath);
})();
