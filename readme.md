# Iliad Standard Issue

![BannerImage](https://raw.githubusercontent.com/iliadwebdev/.github/refs/heads/main/profile/assets/iliad_github.webp)

[Website](https://iliad.dev/?from=std-issue) | [GitHub](https://github.com/iliadwebdev) | [NPMJS](https://www.npmjs.com/org/iliad.dev)

A monorepo containing a suite of tools and packages designed to streamline and standardize development across projects at [Iliad.dev](https://iliad.dev). The **Iliad Standard Toolkit** provides utility functions, configurations, adapters, and more, all optimized for use with modern JavaScript and TypeScript projects, particularly those utilizing Next.js and Strapi.

---

## Table of Contents

- [Packages](#packages)
  - [@iliad.dev/ts-utils](#iliaddevts-utils)
  - [@iliad.dev/primitive-extensions](#iliaddevprimitive-extensions)
  - [@iliad.dev/config-eslint](#iliaddevconfig-eslint)
  - [@iliad.dev/config-typescript](#iliaddevconfig-typescript)
  - [@iliad.dev/hermes](#iliaddevhermes)
  - [@iliad.dev/standard-issue](#iliaddevstandard-issue)
  - [@iliad.dev/strapi-adapter](#iliaddevstrapi-adapter)
  - [@iliad.dev/vulcan](#iliaddevvulcan)
  - [@iliad.dev/build-scripts](#iliaddevbuild-scripts)
  - [@iliad.dev/thoth](#iliaddevthoth)
- [Apps](#apps)
  - [iliad-component-showcase](#iliad-component-showcase)
  - [iliad-server-showcase](#iliad-server-showcase)
- [Setup and Installation](#setup-and-installation)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

---

## Packages

### @iliad.dev/ts-utils

A collection of small utility functions and a plethora of utility types to enhance TypeScript development.

- **Features**:
  - Utility functions for common tasks.
  - Advanced TypeScript types for type transformations and validations.

### @iliad.dev/primitive-extensions

Extensions on JavaScript primitives like `String`, `Array`, `Number`, etc., adding useful methods to their prototypes.

- **Note**: Modifying prototypes can have unintended side effects. Use with caution and ensure it doesn't conflict with other libraries.

### @iliad.dev/config-eslint

Shared ESLint configurations to maintain consistent code quality and style across projects.

- **Usage**:
  - Extend from `@iliad.dev/config-eslint` in your project's ESLint configuration.

### @iliad.dev/config-typescript

Shared TypeScript configurations for consistent compiler settings.

- **Usage**:
  - Extend from `@iliad.dev/config-typescript/tsconfig.json` in your project's `tsconfig.json`.

### @iliad.dev/hermes

Standardizes APIs and responses between `fetch` and `axios` for projects where both are necessary.

- **Features**:

  - Responses modeled after Golang's `result, err = whatever()` pattern.
  - Explicit error handling to reduce headaches from network requests.

- **Usage**:

  ```typescript
  import { Hermes } from "@iliad.dev/hermes";

  const hermes = new Hermes({ baseURL: "https://api.example.com" });

  const { data, error } = await hermes.fetch("/endpoint");
  if (error) {
    // Handle error
  } else {
    // Use data
  }
  ```

### @iliad.dev/standard-issue

A collection of components, styles, hooks, types, etc., for use in Next.js projects. Strongly opinionated towards our stack.

- **Features**:
  - Reusable React components.
  - Custom hooks for common patterns.
  - Shared styles and theming.

### @iliad.dev/strapi-adapter

A fully-typed client library for interfacing with **Strapi v4**, offering seamless integration through three operation modes: **REST API**, **CRUD operations** (recommended), and **Semantic operations**.

- **Unique Feature**: Automatically downloads types from the Strapi server when paired with the `@iliad.dev/plugin-strapi-adapter` package. Provides intelligent autocompletion for API endpoints, content types, filter & query params, populate keys, etc.

- **Benefits**:

  - Saves development time with type safety and autocompletion.
  - No other library offers this level of integration and typing.

- **Future Plans**:

  - Authentication features and additional enhancements.

- **Usage**: Refer to the [Strapi Adapter README](./packages/strapi-adapter/README.md) for detailed instructions.

### @iliad.dev/vulcan

**Status**: Work in Progress (WIP)

A collection of code generators for the projects above, utilizing plopfiles.

- **Features**:

  - Automates boilerplate code generation.
  - Ensures consistency across projects.

- **Usage**:
  - Coming soon. Stay tuned for updates.

### @iliad.dev/build-scripts

Scripts for building and bundling packages.

- **Features**:
  - Streamlined build processes.
  - Consistent build configurations across packages.

### @iliad.dev/thoth

**Status**: Work in Progress (WIP)

A logging library that makes logs pretty, standard, and project-agnostic. Provides utilities for logging locally, externally, and via webhooks.

#### Features

- **Override `console.log`**: Utility function to override `console.log` with added typing.
- **Instantiable**: Exports a default instance of Thoth but can also be instantiated separately.
- **Hanging Logs**: Utilize `ora` to create spinners that can be resolved, timed out, failed, warned, etc.
- **Customization**:
  - Project-level prefixes (e.g., Iliad prefix **◭**).
  - Timestamps with customizable formats.
- **Event Emission**: Extends EventEmitter to allow for side effects.
- **Internationalization**: Ability to provide text snippets with potential for autocompletion.
- **Markup Support**: Possible support for markup tags like `<code>`, `<strong>`, `<em>`, etc.

#### API Example

```typescript
import thoth from "@iliad.dev/thoth";

thoth.log("Simple log message");

// Advanced API
const _log = thoth.$log("Waiting for operation").stamp(); // Outputs loading spinner with timestamp

const { data, error } = await someAsyncOperation();
if (error) _log.fail("Operation failed!");

if (data) {
  _log.$succeed((details) => `Operation succeeded in ${details.totalTime}`);
} else {
  _log.resolve("Operation completed, but duration unknown.");
}
```

#### Open Questions

- **Logging Levels**: Determining appropriate logging levels and their usage.
- **Subprocess Handling**: Exploring algorithms for handling subprocesses, possibly from `atlas-strapi-instance`.

---

## Apps

### iliad-component-showcase

A simple Next.js project for testing components during development.

- **Features**:

  - Serves as a playground for React components from `@iliad.dev/standard-issue` and other packages.
  - Allows for rapid prototyping and visual testing.

- **Usage**:
  - Navigate to the `apps/iliad-component-showcase` directory.
  - Install dependencies: `pnpm install`
  - Run the development server: `pnpm run dev`

### iliad-server-showcase

A simple Node.js server for testing non-frontend functionalities during development.

- **Features**:

  - Provides an environment to test backend logic, APIs, and integrations.
  - Useful for testing packages like `@iliad.dev/hermes` and `@iliad.dev/thoth`.

- **Usage**:
  - Navigate to the `apps/iliad-server-showcase` directory.
  - Install dependencies: `pnpm install`
  - Start the server: `pnpm run start`

---

## Setup and Installation

This monorepo uses [Turborepo](https://turbo.build/repo) and [PNPM Workspaces](https://pnpm.io/workspaces) for managing multiple packages and apps.

### Prerequisites

- **Node.js** v18 or higher
- **NPM** Package Manager

1. **Clone the Repository**:

```bash
   git clone https://github.com/iliadwebdev/iliad-standard-issue.git
```

2. **Navigate to the Repository:**

```bash
    cd iliad-standard-issue
```

3. **Install Dependencies:**

```bash
    npm install
```

4. **Build Packages**

```bash
    npm run build
```

This will build all packages and apps in the correct order based on dependencies.

---

### License

This project is licensed under the MIT License.

---

_Part of the **Iliad Standard Toolkit**, a collection of tools used internally by [Iliad.dev](https://iliad.dev/?from=std-issue) to speed up development._

---

**Note:** Some packages are still in development (marked as WIP). Features and APIs are subject to change. This monorepo is not, as a whole, particularly useful. Several of the packages within may be, however. See their readme.mds for more details
