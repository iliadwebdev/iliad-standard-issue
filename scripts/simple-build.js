const path = require("path");
const fs = require("fs");

const ignoreFiles = [
  "package.json",
  "node_modules",
  "turbo.json",
  ".turbo",
  "dist",
];

(function () {
  const root = path.resolve(process.cwd());
  const outDir = path.resolve(root, "dist");

  const files = fs.readdirSync(root).filter((file) => {
    return !ignoreFiles.find((ignoreFile) => file.endsWith(ignoreFile));
  });

  // Copy files to outDir

  fs.mkdirSync(outDir, { recursive: true });

  files.forEach((filePath) =>
    fs.copyFileSync(
      path.resolve(root, filePath),
      path.resolve(outDir, filePath)
    )
  );
})();
