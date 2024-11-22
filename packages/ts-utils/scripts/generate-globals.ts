import ts from "typescript";
import path from "path";
import fs from "fs";

// Array of TypeScript files to process
const tsFiles = [
  "./src/@types/keystores.ts",
  "./src/@types/utility_types.ts",
  // Add more file paths as needed
];

const __dirname = process.cwd();

// Output file
const outputFilePath = path.resolve(__dirname, "./src/@types/globals.d.ts");

// Function to process each file
function processFiles(files) {
  let globalTypesContent = "";
  let importsContent = "";

  const collectedImports = new Map(); // To avoid duplicate imports

  files.forEach((filePath) => {
    const absolutePath = path.resolve(__dirname, filePath);
    const sourceCode = fs.readFileSync(absolutePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.Latest,
      /*setParentNodes */ true
    );

    // Collect import statements
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isImportDeclaration(node)) {
        const importText = node.getFullText(sourceFile).trim();
        collectedImports.set(importText, true);
      }
    });

    const typeDeclarations: string[] = [];

    ts.forEachChild(sourceFile, (node) => {
      if (
        ts.isTypeAliasDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isClassDeclaration(node)
      ) {
        // Collect the full text of the type declaration
        let typeText = node.getFullText(sourceFile).trim();

        // Check if the type was exported in the original file
        const isExported =
          node.modifiers &&
          node.modifiers.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
          );

        // Adjust the 'export' keyword based on whether it was exported
        if (isExported) {
          // Ensure it starts with 'export'
          if (!typeText.startsWith("export")) {
            typeText = "export " + typeText;
          }
        } else {
          // Remove 'export' if present
          typeText = typeText.replace(/^export\s+/, "");
        }

        typeDeclarations.push(typeText);
      }
    });

    if (typeDeclarations.length > 0) {
      globalTypesContent += typeDeclarations.join("\n\n") + "\n\n";
    }
  });

  // Construct the imports content
  if (collectedImports.size > 0) {
    importsContent = Array.from(collectedImports.keys()).join("\n") + "\n\n";
  }

  if (globalTypesContent) {
    const outputContent =
      importsContent +
      `declare global {\n${indent(globalTypesContent, 2)}}\n\nexport {};\n`;
    fs.writeFileSync(outputFilePath, outputContent, "utf8");
    console.log(`Global types written to ${outputFilePath}`);
  } else {
    console.log("No types found.");
  }
}

// Helper function to indent content
function indent(text, spaces) {
  const indentation = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? indentation + line : line))
    .join("\n");
}

// Run the script
processFiles(tsFiles);
