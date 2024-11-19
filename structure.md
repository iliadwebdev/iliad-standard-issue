## Iliad Standard Issue

Time to put on my big boy pants and turn this into a proper monorepo. Here's how I think I'll organize things:

@iliad.dev/ (Easy way to alias to @iliad? Someone took the namespace :/)

- Monorepo

  - Packages
    <!-- These ones are just dynamic-ish exports that fit all /ns/p/<whatever> under the same export.  -->

    - @types `exports all @types from installed packages`
    - components `exports all components from installed packages`
    - hooks `exports all hooks from installed packages`
    - utils `exports all utils from installed packages`
    - configs `Configuration files for stuff.`
    - iliad-stylesheets `Collection of reset sheets, Iliad brand styles, SCSS functions, etc.`
    - iliad-node `General JS utilities.`

      - @types
      - utils

    - iliad-react `Components / Hooks that will work in vanilla React.`

      - components
      - hooks
      - @types
      - utils

    - iliad-next `Components / Hooks that will use Next.js functionality. Most may just end up wrapping iliad-react components.`
      - components
      - hooks
      - @types
      - utils
    - Primitive-Extensions `A set of methods that extend primitives. Is this stupid? Probably.`
      - Array
      - Math
      - Number
      - etc.
    - Hermes `A wrapper on top of a few network adapters that normalizes APIs between them and returns golang-style {data, error} responses.`
      - Hermes, nuff said
    - Strapi-Adapter `A client library for interfacing with Strapi. Other ones exist, I just think they aren't very good *and* don't play nicely with Next.js`
      - ^. Somehow I'll need a way to access ContentTypes that exist in the source project.
    - Vulcan `Collection of plopfiles for different project types. I'll need to figure out a solid API to specify the type of project to work in.`
      - templates
        - react
        - next
        - node
        - etc...
      - generators
        - react
        - next
        - node
        - etc...
    - Hephaestus `NPX script to configure all the above. Never made one of these before so we'll see how it turns out.`
      - No idea what goes into an npx script tbh

  - Scripts

- Namespace (@iliad/)
  - next-components
  - react-components
  - node-utils
  - next-utils
  - react-utils
  - node-types
  - next-types
  - react-types
  - @types `exports all @types from installed packages`
  - components `exports all components from installed packages`
  - hooks `exports all hooks from installed packages`
  - utils `exports all utils from installed packages`
  - configs `Configuration files for stuff.`
  - stylesheets `Collection of reset sheets, Iliad brand styles, SCSS functions, etc.`
  - Hermes
  - strapi-adapter
  - vulcan (dev dependency probably)
