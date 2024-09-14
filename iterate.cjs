(function (pkg) {
  function iterateVersion(v) {
    let [major, minor, patch] = v.split('.');
    patch++;
    return [major, minor, patch].map((x) => parseInt(x));
  }

  const [major, minor, patch] = iterateVersion(pkg.version);
  pkg.version = `${major}.${minor}.${patch}`;
  require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
})(require('./package.json'));
