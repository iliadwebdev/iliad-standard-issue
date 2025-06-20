import prettier from "prettier";
import chalk from "chalk";
import path from "path";
import fs from "fs";

export default async function generateGlobals() {
  console.log(chalk.magentaBright("Generating global types..."));
  const startTime = Date.now();

  const indexDtsPath = path.resolve(process.cwd(), "./dist/index.d.ts");

  const fileContents = fs.readFileSync(indexDtsPath, "utf8");
  const fileLines = fileContents.split("\n").map((line) => line.trim());

  let importLines: string[] = [
    "// This file is automatically generated by tsup. Do not edit it directly.",
  ];
  let remainder: string[] = [];

  for (const line of fileLines) {
    if (line.startsWith("import")) {
      importLines.push(line);
    } else {
      remainder.push(line);
    }
  }

  let productLines: string[] = [];
  for (const line of importLines) {
    productLines.push(line);
  }

  for (const line of remainder) {
    productLines.push(line);
  }

  productLines.push("\n", "declare global {");
  for (const line of remainder) {
    productLines.push(line);
  }
  productLines.push("}", "\n", "export {}");

  const content = productLines.join("\n");

  try {
    const formattedContent = await prettier.format(content, {
      parser: "typescript",
    });

    console.log(formattedContent);

    fs.writeFileSync(indexDtsPath, formattedContent);
    const timeElapsed = Date.now() - startTime;
    console.log(
      chalk.greenBright(indexDtsPath),
      chalk.magentaBright(
        `Generated global types in ${chalk.yellowBright(timeElapsed)} ms`
      )
    );
  } catch (e) {
    console.error(`Error formatting file: ${indexDtsPath}`);
    console.error(e);
  }
}

(async () => {
  try {
    await generateGlobals();
  } catch (e) {
    console.error("Error generating globals");
    console.error(e);
  }
})();
