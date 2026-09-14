# Ben's Burgers v31 — customer performance and cash handoff

## Implemented

- Existing illustrated faces are retained, resized and aligned with articulated 2D bodies. Separate source-aligned eye patches blink and mouth patches move during greeting/thanks; heads nod gently. This is modest 2D facial animation, not 3D motion capture or voiced dialogue.
- Arms now have elbow and hand joints. Legs have knee and ankle joints. Gait is driven by distance travelled, with planted stance feet and raised swing feet. Entrance and exit keep a fixed scale and floor height; the old shrinking/fading/vertical-glide exit is removed. Customers turn toward the doorway to leave.
- The counter is a separate foreground surface. On Serve the customer reaches toward their pocket, holds a bill, extends the arm over the counter and releases it. The deposited bill remains on the counter while the customer leaves.
- The in-game wallet, earnings, score and served-order count update exactly once at the deposit (1.35 seconds into a 2.2-second paying phase), followed by a 2.2-second exit. The existing register chime now plays at the cash handoff. Repeated taps cannot pay twice.
- Pending/credited payment state is saved. Restoring before deposit resumes one payment; restoring afterward cannot credit it again. Old v29 served orders are already paid and are not credited again. The v27 game save key, upgrades, cash, original sound files and one-burner starting rules are retained.
- Pause freezes the arms, faces and payment timer as well as game timers. Reduced-motion mode retains the cash event without walking or blinking.

## Validation executed

`node v31-model.test.cjs`: 21 passing test groups. Covers the starter stand, payment boundary, duplicate taps/credits, incomplete orders, pause, pre/post-payment restore, last-order restore, old-save migration, large clock steps, payment/exit ordering, shop affordability, wrong ingredients, burning/undo, arrival-time food protection, all 128 topping-unlock combinations, fully unlocked recipes with all four sides combinations, multi-customer ownership, planted-foot geometry, finite limb solving and all five facial/limb structures.

`node sound-v29.test.cjs`: 20 existing audio tests passed. Sound implementation files are unchanged.

Completed Chromium/Playwright suites recorded 26 interaction assertions and 31 layout/reduced-motion assertions (57 executed assertions, including repeated reduced-motion checks). Touch controls cooked and served five orders, checked delayed cash, visible held/deposited bills, moving elbows/knees, pause, fixed-scale exit, all five faces, shift summary and shop return. No JavaScript exceptions were recorded in those completed suites.

Layout sizes: 430x880 for the interaction pass; 926x355, 926x428, 844x390, 812x375, 667x300, 1024x768, 1440x900, 390x844 and 430x932 for layout. Checks included full head frames inside the customer area, visible Serve, no horizontal overflow, button-center hit targets, reachable shop Close, and synthetic 44px side / 21px bottom safe insets.

A separate screenshot-recording pass verified changing mouth transforms, 11 actual SVG planted-foot comparisons (under 0.75 CSS-pixel drift while the torso moved), stationary deposited cash through exit, and proportionate bill sizing. It recorded actual game frames, not concept art.

Visual review caught and corrected the deposited bill following the departing customer. Code review also caught a foreground-arm cache retaining an older customer's rig; the cache now refreshes when the actual rig element changes. Production-file Git blob hashes were checked against local source, including the final renderer. The model suite was rerun after the final renderer fix.

## Limits

Browser navigation in the test runtime is blocked by administrator policy. Tests therefore loaded the actual local HTML/CSS/JS into an isolated Chromium document, embedded the existing local image bytes, and used an explicitly identified in-memory Storage adapter. These are not physical iPhone/Safari tests or native-browser storage persistence tests. Some longer combined/repeated runs hit the execution time limit; completed interaction and layout results were recorded separately. Deployment is checked separately using GitHub Pages status, not inferred from a merge.
