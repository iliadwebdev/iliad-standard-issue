#!/usr/bin/env tsx

const [, , command, ...args] = process.argv;

const script = (name: string) => import(`./scripts/${name}/index.ts`);

switch (command) {
  case "prebuild":
    await script("prebuild");
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
