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
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

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
        // Check if the type was exported in the original file
        const isExported =
          node.modifiers &&
          node.modifiers.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
          );

        // Adjust the 'export' keyword based on whether it was exported
        let modifiers = node.modifiers ? [...node.modifiers] : [];

        if (isExported) {
          // Ensure 'export' modifier is present
          if (
            !modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
          ) {
            modifiers = [
              ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
              ...modifiers,
            ];
          }
        } else {
          // Remove 'export' modifier if present
          modifiers = modifiers.filter(
            (mod) => mod.kind !== ts.SyntaxKind.ExportKeyword
          );
        }

        // Create a new node with the updated modifiers
        const updatedNode = updateNodeWithModifiers(node, modifiers);

        // Print the updated node
        const typeText = printer.printNode(
          ts.EmitHint.Unspecified,
          updatedNode,
          sourceFile
        );

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

// Helper function to update node modifiers
function updateNodeWithModifiers(node, modifiers) {
  if (ts.isTypeAliasDeclaration(node)) {
    return ts.factory.updateTypeAliasDeclaration(
      node,
      modifiers,
      node.name,
      node.typeParameters,
      node.type
    );
  } else if (ts.isInterfaceDeclaration(node)) {
    return ts.factory.updateInterfaceDeclaration(
      node,
      modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      node.members
    );
  } else if (ts.isEnumDeclaration(node)) {
    return ts.factory.updateEnumDeclaration(
      node,
      modifiers,
      node.name,
      node.members
    );
  } else if (ts.isClassDeclaration(node)) {
    return ts.factory.updateClassDeclaration(
      node,
      modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      node.members
    );
  }
  // Return the node unmodified if it's none of the above
  return node;
}

// Run the script
processFiles(tsFiles);
