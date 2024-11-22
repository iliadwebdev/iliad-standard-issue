import path from "path";
import fs from "fs";
const __dirname = process.cwd();
const indexPaths = ["./dist/index.d.ts", "./lib/index.d.ts"].map((p) =>
  path.resolve(__dirname, p)
);

const globalsPath = path.resolve(__dirname, "./src/@types/globals.d.ts");
const globalsContent = fs.readFileSync(globalsPath, "utf-8");

indexPaths.forEach((indexPath) => {
  if (!fs.existsSync(indexPath)) {
    console.error(`File not found: ${indexPath}`);
    return;
  }
  const indexContent = fs.readFileSync(indexPath, "utf-8");
  fs.writeFileSync(indexPath, `${globalsContent}\n${indexContent}`);
});

console.log("Merged globals into index.d.ts files");
