# Iliad Standard Issue

![BannerImage](https://raw.githubusercontent.com/iliadwebdev/.github/refs/heads/main/profile/assets/iliad_github.webp)

[Website](https://iliad.dev/?from=std-issue) | [GitHub](https://github.com/iliadwebdev) | [NPMJS](https://www.npmjs.com/org/iliad.dev)

A monorepo containing a suite of tools and packages designed to streamline and standardize development across projects at [Iliad.dev](https://iliad.dev). The **Iliad Standard Toolkit** provides utility functions, configurations, adapters, and more, all optimized for use with modern JavaScript and TypeScript projects, particularly those utilizing Next.js and Strapi.

---

## Table of Contents

- [Iliad Standard Issue](#iliad-standard-issue)
  - [Table of Contents](#table-of-contents)
  - [Paradigm](#paradigm)
    - [Structure \> syntax](#structure--syntax)
      - [Transgression](#transgression)
      - [Adherence](#adherence)
      - [Recap](#recap)
    - [Good code is beautiful, beautiful code is good](#good-code-is-beautiful-beautiful-code-is-good)
      - [Transgression + Adherence](#transgression--adherence)
      - [Recap](#recap-1)
    - [Single-ish Responsibility Functions](#single-ish-responsibility-functions)
    - [Purity where Possible](#purity-where-possible)
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
      - [Features](#features)
      - [API Example](#api-example)
      - [Open Questions](#open-questions)
  - [Apps](#apps)
    - [iliad-component-showcase](#iliad-component-showcase)
    - [iliad-server-showcase](#iliad-server-showcase)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [License](#license)

---

## Paradigm

With every project I work on, the more my appreciation grows for predictability, robustness, and agility. To maximize the product of my time, and minimize confusion when implementing these tools in different contexts, the following principles should be followed when possible. This list is neither exhaustive nor strict, but hopefully it informs some of the decisions I make when developing tooling for [Iliad](https://iliad.dev).

### Structure > syntax

It can be tempting to abstract every feature away into robust, semantic APIs. This is sometimes appropriate (particurly when constructing the final, public-facing API for a package), but can leading to major headaches when configuring tooling and, frankly, doesn't often save as much time as initially anticipated.

#### Transgression

I spent a great deal of time building post-installation scripts for [@iliad.dev/standard-issue](https://github.com/iliadwebdev/iliad-standard-issue/tree/main/packages/standard-issue) that would collect components for different environments (e.g. React / Next / Node) into one export under a namespace I don't actually own. What I was hoping to achieve:

```tsx
// Hoping to achieve this
import { ExtLink, Clamp, Typography } from "@iliad/components";

// Instead of this
import { Clamp, Typography } from "@iliad.dev/standard-issue/react";
import { ExtLink } from "@iliad.dev/standard-issue/next";
```

This functionality is - of course - possible with enough finangling. But the hours I spent on this feature (that no client will ever see) will take years to pay back through the seconds on the hour I save over the course of the next several years (by which point this code will be outdated and I will probably be an auto mechanic or mossad agent or something).

#### Adherence

When developing [@iliad.dev/thoth](https://github.com/iliadwebdev/iliad-standard-issue/tree/main/packages/thoth) I was very tempted to try to side-step the necessity for `Node16` module imports imposed by [Ink](https://github.com/vadimdemedes/ink) (brilliant project, btw. utterly unhinged) to preserve my pretty `NodeNext` imports.

While this is - again - possible, I had learned my lesson and simply re-organized my code, so that each module that was required by a file sat at the highest-level of mutual requirement (that is to say, if a **utility** is required by six **classes**, it will sit under the `src/classes/utils` folder. If it is required by six **classes** and a **script**, it may sit under the `src/utils` folder).

#### Recap

When possible, prefer solid, predictable structure over arcane syntax that makes your code look pretty at the expense of a ridiculous number of hours.

### Good code is beautiful, beautiful code is good

Spend the time to organize code beyond simply the logical flow of the package. Within the parameters of your linting tool, you have a lot of leeway for how your code is structured. Where possible, structure your functions in a way that is clear, self-documenting, and readable. Avoid deeply-nested expressions and name variables and functions in a way that is clear, but concise.

Beyond this, organize your code aesthetically. Every extra second you invest in the early morning when you are sharp and caffeinated turns into another minute of productivity at the end of the day when your brain is trying to escape through your nose. Aesthetically pleasing code is easer for the overwhelmed brain to parse, leaving a greater cognitive-margin-of-error so you can stay productive even when you're not at your best.

This is the perfect opportunity to employ these Syntactic Abstractions from pt one. It hides away code, but if these abstractions are documented and semantic (and their implementation is used frequently), it will make your code pretty and - more importantly - infinitely easier to understand.

> Remember: 99% of the code you read through when fixing a problem doesn't need to be _specifically_ understood. With the exception of the specific bit of code that is causing the problem, understanding the _purpose_ of that code is sufficient.

#### Transgression + Adherence

!(GoodVsBadCode1)[./md-assets/good-vs-bad-1.png]

#### Recap

Put in the effort to make your code pretty. Mog on other devs, make code readable without headache. Simple as.

### Single-ish Responsibility Functions

Extract complex/compound functionality to semantically named functions, even when that function isn't necessarily re-used. See Point 2.


> Will be expanded

### Purity where Possible

Avoid taking data from context whereever possible, try to keep functions as pure as possible. Where unavoidable, extract context-aquisition to functions/hooks/methods then pass that context to a pure function.

Understanding what the heck is going in/out of functions is absolutely critical.

> Will be expanded


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
