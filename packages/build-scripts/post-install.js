const { startAtRoot } = require("./start-at-root");
const fs = require("fs");

startAtRoot(async (rootPath, modulePath, pkgJson) => {
  fs.writeFileSync(
    `${modulePath}/post-install.log`,
    `Post-Install script run from package [${pkgJson.name}]\nRoot Path: ${rootPath}\nModule Path: ${modulePath}\n`
  );
  console.log(`Post-Install script run from package [${pkgJson.name}]`);

  // This is where we'll aggregate certain modules into one export... Probably a good idea to make this typescript later.
});
