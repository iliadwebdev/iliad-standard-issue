# Thoth

Logging library. Makes logs pretty, standard, project-agnostic. Provides utilities for logging locally, externall, via webhooks, etc.

## Features

- Utility function that can be called to override console.log + provide typing
- Exports default instance of Thoth as default, but can be Instantiated as well.
- `hanging()` logs (api? `thoth.hanging(options).log()`?). Uses ORA to make spinner, can be resolved, timed out, failed, warned, etc.
- Project-level prefix, (config.thoth.ts?), Iliad prefix **◭**, timestamp w. formats.
- Thoth extends event emitter, allowing for side-effects (?)
- Add ability to provide text snippets / internationalisation. Autocomplete possible.
- Possible add ability to provide markup/down tags? <code> <strong> <italic> etc could be useful.

## API

```tsx
import thoth from '@iliad.dev/thoth`;


thoth.log(...args);

// IDEA: Normal api .log, .warn, .error, etc.
// Power API: $log, $warn, $error

// Hanging log API?
const _log = thoth.$log("Waiting for thing").stamp(); // Outputs loading spinner, creates timestamp.

const {data, error} = await thing();
if(error !== undefined) _log.fail("Thing failed!") // Fail emoji...

if(true) {
    _log.$succeed((details: DetailsAboutEvent)=> {
        return `Event concluded in ${details.totalTime}`
    })
} else {
    _log.resolve("Event concluded, but we don't know how long it took :/")
}


```

## Questions

- What the heck are logging levels?
- How am I going to handle subprocesses? Can I take the algorithm from `atlas-strapi-instance`?
