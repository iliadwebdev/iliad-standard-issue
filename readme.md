# Iliad Standard Issue

This is a collection of components, types, utility functions, stylesheets, etc. that are common among many Iliad projects.

This is _not_ an npm package for three reasons:

1. It is not meant to be a canonical source for Ilaid components. Instead, it should be used as a starting point for new projects.
2. It uses a number of experimental features, requiring unsafe npm flags. Rather than pollute the package resolution tree, I prefer to keep all the nonsense at the top-level.
3. I couldn't get the @iliad namespace on npm, which makes me sad ☹️.

This can be set up in two ways: Components can be copied directly into the `/src/` directory of a new project, or the entire `iliad` folder can be dropped under `/src/` and imported as a module. The latter approach has the benefit of allowing for incremental adoption of new features, if desired.

## Module resolution config / aliases

I'm a big fan of the following `tsconfig.json` setup:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@iliad/*": ["iliad/*"],
      "@iliad/hooks/*": ["iliad/utils/hooks/*"],
      "@iliad/functions/*": ["iliad/utils/functions/*"]
    }
  }
}
```

## Prerequisites

This assumes the following project setup:

- Primitive Extensions are imported at the top level of the app
- Core styles are imported at the top level of the app
- Next.js 13 or above, pages or app router
- Mantine is configured properly

## Components

### `PowerButton`

An extension of `@mantine/core/Button` that adds a few loosely-styled variations. Useful for the majority of applications, and has logic for mobile-only interactions.

### IliadLogo

A fancy logo for the bottom of the page. I need to incorporate assets directly into the project, as well as utilize `next/image` rather than img.

### DynamicReactIcon

Allows react-icons to be dynamically imported. Works with app router.

### Clamp

Simple div with styles to clamp content to specific width, with respect to mobile margin.

### Conditional wrapper

A wrapper that conditionally renders children based on a boolean prop.

### IliadImage

A wrapper around next/image that, at present, only adds Alt text.

### ExtLink

A wrapper around next/link that does a few things:

1. Opens external links in new tabs and adds appropriate rel attributes
2. Normalizes styles for links
3. Normalizes props for links
4. Redirects relative links to the root domain for micro-sites
