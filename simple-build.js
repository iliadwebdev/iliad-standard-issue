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

  function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    });

    return arrayOfFiles;
  }

  const files = getAllFiles(root).filter((file) => {
    return !ignoreFiles.find((ignoreFile) => file.includes(ignoreFile));
  });

  // Copy files to outDir

  fs.mkdirSync(outDir, { recursive: true });

  files.forEach((filePath) => {
    const relativePath = path.relative(root, filePath);
    const destinationPath = path.resolve(outDir, relativePath);
    const destinationDir = path.dirname(destinationPath);

    fs.mkdirSync(destinationDir, { recursive: true });
    fs.copyFileSync(filePath, destinationPath);
  });
})();
