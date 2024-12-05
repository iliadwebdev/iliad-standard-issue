import blessed from "blessed";
import { Widgets } from "blessed";

export function createBlessedScreen(): [Widgets.Screen, Widgets.BoxElement] {
  // Create a screen object.
  const screen = blessed.screen({
    smartCSR: true,
    mouse: true,
  });

  screen.enableMouse();
  screen.enableInput();
  screen.enableKeys();

  // Create a box perfectly centered horizontally and vertically.
  var box = blessed.box({
    top: "center",
    left: "center",
    width: "100%",
    mouse: true,
    keyable: true,
    height: "100%",
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    // content: "Hello {bold}world{/bold}!",
    tags: true,
    scrollbar: {
      //   bg: "yellow",
    },
    border: {
      //   type: "line",
    },
    content: "Hello {bold}world{/bold}!",
  });

  // This maintains scrolling functionality, fixes the scroll speed on mac, and makes text selectable
  // Not really sure what Blessed did to bugger up the scrolling, but this fixes it
  screen.program.disableMouse();

  screen.title = "testing title";

  // Append our box to the screen.
  screen.append(box);

  // Quit on Escape, q, or Control-C.
  screen.key(["escape", "q", "C-c"], function (ch, key) {
    return process.exit(0);
  });

  // Focus our element.
  box.focus();

  // Render the screen.
  screen.render();

  return [screen, box];
}
