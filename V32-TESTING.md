# Ben's Burgers v32 — illustrated starter stand

## Shipped presentation

A compact wooden burger stand replaces the previous diner-like prototype. It has a striped awning, outdoor-window backdrop, serving counter, dimensional food wells and illustrated griddle. A new game visibly starts with one usable cooking area and only bun base, raw patty and bun top. Purchased toppings add trays, purchased burners add cooking spaces, and the fryer/drink setup appears after purchase. Existing prices and unlock conditions are unchanged.

The native 1024x713 WebP atlas contains food, griddle and complete upper-body customer illustrations derived from the approved artwork already supplied in this conversation. The primary buns, raw/cooking/ready patties, cheese, vegetables and cooked bacon use separate sprite crops. Burger previews and assembly use exact recipe layers and compact overlap. Raw bacon, sauce, sides and machine illustrations retain portions of the earlier renderer. This is not a claim that every old graphic has been replaced.

All five customers use cohesive illustrated heads and torsos rather than independently assembled heads on the previous SVG bodies. Eddie has modest source-art sleeve/hand and eye/mouth motion. Customers approach and leave at a fixed scale behind the counter; the close counter view obscures most of their legs. This is still limited 2D animation, not new full-body 3D characters or a complete natural walk-cycle asset set for all five people.

The sound-v29 implementation is unchanged. The v27 save key, cash, purchases, current recipes, cooking jobs and v31 exactly-once cash handoff are retained. New games start with Eddie; restored games keep their existing customer and progress. Tier upgrades currently change materials and add owned stations, not the complete late-game restaurant shown in the approved concept.

## Verification performed

- 11 v32 model test groups pass, including all 128 topping-unlock combinations, starter inventory, locked burner protection, migration from v31, recipe stability during purchases, payment timing, pending-payment restore, atlas bounds and production file references.
- The existing 21 v31 model groups and 20 audio test cases pass unchanged.
- GitHub Actions runs JavaScript syntax checks, all three suites, and a SHA-256 check of the native artwork. Source-check run 34808007128 completed successfully.
- The exact source archive from that Actions run was downloaded and compared with the local tested source. HTML, JavaScript, atlas and metadata matched byte-for-byte. The remote CSS contained one harmless duplicate border-radius declaration; that exact remote CSS was adopted and the browser suites were rerun.
- Final isolated Chromium touch play-through: 22 assertions passed through all five first-shift orders, cash handoff, duplicate-serving guard, buying cheese and the next order requesting cheese.
- Separate final browser suite: 30 assertions passed for shop pause, saved-state restore, current recipe preservation, paused customer motion, existing volume controls, all five illustrated customers, all owned ingredient/equipment layouts, synthetic safe insets and reduced motion. No JavaScript page errors were recorded.
- Layout sizes: 926x355, 844x390, 667x300, 1024x768, 1440x900, 390x844 and 430x932; the interaction pass used 430x880. Tests checked visible Serve, no horizontal overflow, button-center hit targets and reachable shop Close. Synthetic 44px side and 21px bottom safe insets were tested at 926x355.
- Actual rendered screenshots were inspected. Fixes during testing included inherited SVG dimensions stretching sprite crops, too-small grill targets in short landscape view, and burger layers spaced too far apart.

## Asset transport and integrity

The approved image pixels were transferred as temporary text chunks, reconstructed under a checksum guard, and committed as the native stand-art-v32.webp file. Temporary chunks and the reconstruction script were removed before publication. The production page only references the native image. Expected SHA-256: ccf4f74782f1f155632fdb3c66ffee016af7752f047838aceebbaf7aaad01dda. The retained release-check workflow has read-only repository permissions.

## Testing limits and unfinished work

Browser navigation is blocked in this runtime. Playwright therefore used isolated Chromium documents with the exact local HTML/CSS/JS, embedded native image bytes, and an explicitly identified in-memory Storage adapter. Save serialization and restoration were tested; physical Safari persistence and iPhone rendering were not. Local render checks are separate from the GitHub Pages deployment verification.

This is the starter-stand art pass, not a pixel-identical recreation of the high-resolution concept image. The richer late-game environment, higher-resolution source characters and complete per-character facial/limb animation remain further work. No user save reset, real-money purchase, new tracking, external font dependency or sound redesign is introduced.
