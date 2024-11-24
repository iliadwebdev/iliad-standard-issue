# @iliad.dev/strapi-adapter

A fully-typed client library for interfacing with **Strapi v4**, offering seamless integration through three operation modes: **REST API**, **CRUD operations** (recommended), and **Semantic operations**. When paired with the `@iliad.dev/plugin-strapi-adapter` package, it automatically synchronizes types from your Strapi server, providing intelligent autocompletion and type safety that saves development time.

---

**Table of Contents**

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
  - [REST API](#rest-api)
  - [CRUD Operations](#crud-operations)
  - [Semantic Operations](#semantic-operations)
- [Type Synchronization](#type-synchronization)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

---

## Features

- **Fully Typed Integration**: Automatically download and synchronize types from your Strapi server when used with `@iliad.dev/plugin-strapi-adapter`.
- **Intelligent Autocompletion**: Get smart suggestions for API endpoints, content types, filters, query parameters, populate keys, and more.
- **Multiple Operation Modes**:
  - **REST API**: Direct interaction with Strapi's REST endpoints.
  - **CRUD Operations**: Simplify Create, Read, Update, Delete operations with type safety (recommended).
  - **Semantic Operations**: Higher-level operations for complex data interactions.
- **Time Saver**: Reduces development time by providing type safety and autocompletion.
- **Extensible**: Authentication features and more coming soon.

---

## Installation

Install the `@iliad.dev/strapi-adapter` package via npm:

```bash
npm install @iliad.dev/strapi-adapter
```

**Optional (Recommended for Type Synchronization):**

```bash
npm install @iliad.dev/plugin-strapi-adapter
```

---

## Getting Started

### Prerequisites

- **Node.js** v12 or higher
- **Strapi** v4
- **TypeScript** (for full typing benefits)

### Setup

1. **Install the Adapter**:

   ```bash
   npm install @iliad.dev/strapi-adapter
   ```

2. **(Optional) Install the Strapi Plugin**:

   ```bash
   npm install @iliad.dev/plugin-strapi-adapter
   ```

3. **Configure the Strapi Plugin** (if installed):

   - In your Strapi project, enable the plugin in `config/plugins.js`:

     ```javascript
     module.exports = {
       // ...other plugins
       "strapi-adapter": {
         enabled: true,
         config: {
           // Plugin configuration
         },
       },
     };
     ```

4. **Initialize the Adapter**:

   ```typescript
   import { StrapiAdapter } from "@iliad.dev/strapi-adapter";
   import { Hermes } from "@iliad.dev/hermes";

   const hermes = new Hermes({ baseURL: "https://your-strapi-api.com" });

   const strapi = new StrapiAdapter({
     client: "fetch", // or 'axios' if preferred
     hermes,
   });
   ```

---

## Usage

### REST API

Interact directly with Strapi's REST endpoints using the adapter's REST methods.

```typescript
// GET request
const response = await strapi.get("/articles");

// POST request
const newArticle = await strapi.post("/articles", {
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    data: { title: "New Article", content: "Content goes here." },
  }),
});
```

### CRUD Operations

Simplify your interactions with Strapi using the built-in CRUD methods.

#### Find

Retrieve a list of entries from a collection.

```typescript
const articles = await strapi.find("articles", {
  filters: { published: true },
  populate: "*",
});
```

#### Find One

Retrieve a single entry by its ID.

```typescript
const article = await strapi.findOne("articles", articleId, {
  populate: "*",
});
```

#### Create

Create a new entry in a collection.

```typescript
const newArticle = await strapi.create("articles", {
  title: "New Article",
  content: "Content of the new article",
});
```

#### Update

Update an existing entry by its ID.

```typescript
const updatedArticle = await strapi.update("articles", articleId, {
  title: "Updated Title",
});
```

#### Delete

Delete an entry by its ID.

```typescript
await strapi.delete("articles", articleId);
```

### Semantic Operations

Perform higher-level operations for more complex data interactions.

#### Get Full Collection

Retrieve all entries from a collection, handling pagination automatically.

```typescript
const fullCollection = await strapi.getFullCollection("articles", {
  populate: "*",
});
```

#### Get Entry by Slug

Retrieve a single entry using a slug field.

```typescript
const article = await strapi.getEntryBySlug("articles", "my-article-slug", {
  populate: "*",
});
```

---

## Type Synchronization

Enhance your development experience with automatic type synchronization.

### Setup

1. **Install the Plugin in Your Strapi Project**:

   ```bash
   npm install @iliad.dev/plugin-strapi-adapter
   ```

2. **Enable the Plugin**:

   In `config/plugins.js` of your Strapi project:

   ```javascript
   module.exports = {
     // ...other plugins
     "strapi-adapter": {
       enabled: true,
       config: {
         // Plugin configuration
       },
     },
   };
   ```

3. **Generate Types**:

   Run the type generation script:

   ```bash
   npm run strapi generate-types
   ```

4. **Use the Generated Types**:

   ```typescript
   import { Article } from "@types/Article";

   const articles: Article[] = await strapi.find("articles");
   ```

   Now, you'll have full type safety and intelligent autocompletion for your Strapi content types.

---

## Contributing

Contributions are welcome! Please read the [contributing guidelines](https://github.com/iliadwebdev/iliad-standard-issue/blob/main/CONTRIBUTING.md) before making a pull request.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/iliadwebdev/iliad-standard-issue/blob/main/LICENSE) file for details.

---

## Links

- **NPM Package**: [@iliad.dev/strapi-adapter](https://www.npmjs.com/package/@iliad.dev/strapi-adapter)
- **GitHub Repository**: [iliad-standard-issue](https://github.com/iliadwebdev/iliad-standard-issue)
- **Iliad.dev**: [Visit our website](https://iliad.dev)

---

_Part of the [@iliad.dev/standard-issue](https://github.com/iliadwebdev/iliad-standard-issue) project, a collection of tools used internally by Iliad.dev to speed up development._

---

**Note**: Authentication features and additional enhancements are planned for future releases. Stay tuned!
