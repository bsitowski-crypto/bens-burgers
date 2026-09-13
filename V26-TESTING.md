# Ben's Burgers v26 — implementation and validation

## Rebuild

- A standalone layout replaces the loaded v23/v24/v25 styles and hotfix scripts. Old source files are retained for history but not loaded by the new index.
- One customer starts at the corner stand. A separate side-mounted ticket displays the exact recipe and sides. After shift 2, optional expansion introduces multiple independent orders, switched through customer tabs, and an additional grill spot.
- Five portraits cut from the existing concept artwork replace the simple drawn avatars. Arrival, idle, happy, and impatient motion is CSS animation, not a rigged 3D character system.
- One shared ingredient renderer produces the order picture, tray ingredients, cooking stages, and overlapping burger layers. Raw, cooking, ready, and burned patties have distinct states. Ingredient artwork remains stylized SVG, not a pixel-perfect copy of the concept image.
- One state model controls selected meat, valid ingredients, hints, side jobs, and serving. Toppings can be placed in any order after the cooked patty; the top bun requires all fillings.
- The fryer takes 6 seconds, the drink filler 3 seconds. Tap to start, then tap to collect. Side jobs are bound to their order IDs.
- Serve names the active customer and turns green when all requested components are ready. The handler validates completeness and blocks double-serving during the transition.
- Welcome instructions, pause/resume, automatic pause on document hiding, undo, and five-order shift summaries are included.

## Validation performed locally, September 13, 2026

### Syntax and model

`node --check v26-game.js` and `node --check v26-art.js`: passed.

`node v26-model.test.cjs`: 32 passing cases. Includes all five recipes with four sides combinations, exact preview-layer matching, wrong-ingredient rejection, stale-selection clearing, cooking and burn boundaries, pause, undo, premature-top-bun rejection, duplicate-serve rejection, shift transition, expansion, side-job ownership, and timeout cleanup.

### Actual browser interaction

Chromium with Playwright touch emulation and a controlled browser clock completed all five first-shift orders through the DOM controls, started and collected the requested sides, checked recipe-preview layers, served, blocked duplicate score changes, reached the shift summary, and continued to shift 2. Pause froze the model for 20 simulated seconds. Portrait-to-landscape rotation preserved screen fit. This interaction pass and the layout pass were evaluated separately because the combined run exceeded the execution window after completing the interaction assertions.

### Layout and touch targets

Passed at 926x355, 926x428, 844x390, 812x375, 740x320, 667x300, 1024x768, and 1440x900: no clipped visible buttons, no horizontal overflow, no overlapping element stealing button-center taps, footer within the viewport, portrait outside the ticket, ingredient button height at least 36 CSS pixels. Synthetic 44px left/right and 21px bottom safe insets passed at both 926px widths.

Portrait 430x800 deliberately scrolls rather than shrinking the kitchen; the Serve footer stays sticky and visible. No JavaScript page errors or browser console errors were recorded in the completed layout pass.

### Limits

These checks used Chromium mobile emulation, not a physical iPhone. WebKit launch was attempted but its executable was not installed in the test runtime; Safari rendering is not independently verified. Local test pages used the exact CSS/JS and inlined portrait bytes because navigation is restricted in the runtime. A live deployment check is separate from these local tests.
