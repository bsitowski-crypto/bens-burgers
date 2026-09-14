# v28 — character, order-picture and formatting corrections

## Shipped changes

- Replaces the seated v26 bust atlas in the active game with transparent head cutouts and complete SVG character rigs: torso, arms, legs, shoes, and joint-based walking. The original illustrated faces are retained. These are stylized 2D characters, not newly rendered 3D models.
- Customers enter over 2.2 seconds with alternating leg/knee and arm motion, approach the foreground counter, settle, and receive a side-mounted order ticket. Served customers nod and leave. Lower bodies become hidden behind the counter intentionally; hair and faces retain their own complete frames. Reduced-motion settings skip movement.
- A shared simulation clock drives the rig and freezes during pause/shop. Ready food is protected while a customer entrance prevents interaction.
- Recalculates burger layers from visible front-edge heights. The cheese is visible beneath the bun rather than being buried. Adds individual ingredient pictures to the recipe checklist. Updates the bread texture, meat speckling, cheese trays, and sauce bottle; vegetables retain the existing stylized drawing language. This is not a pixel-identical reproduction of the concept mockups.
- Adds a doorway, floor, counter edge, and more shaded/beveled prep surfaces. Corrects the tall portrait footer, compact-header logo clipping, and atlas bleed observed during testing.
- The v27 economy, purchase rules, one-burner starting stand, and save key/schema are retained. Existing cash and purchases are not reset. A restored customer's entrance replays without changing their order.

## Tests run before merge

`node v28-model.test.cjs`: 37 passing groups, including all 128 topping-unlock combinations, recipe/preview agreement, exact purchase deductions, save restoration, ready/cooking/burning states, side ownership, serving guards, and the entrance/ready-food regression.

Chromium with Playwright touch emulation: 38 passing assertions. A v27 save with cheese and $14.80 was restored, a cheeseburger was prepared through the controls, wrong taps and double serving were rejected, and the next customer's leg angles and screen position changed during arrival. Pause froze model and body motion. All five head viewport frames were checked inside the customer stage. Game/shop fit and button-center hit testing passed at 430x932, 390x844, 375x667, 926x355, 926x428, 844x390, 740x320, 667x300, 1024x768, and 1440x900. Synthetic 44px side/21px bottom safe areas and reduced-motion mode passed. No JavaScript page errors were recorded.

Actual rendered portrait, landscape, five-character, walking, completed-burger, and cheeseburger-preview images were reviewed. The atlas-bleed and logo/footer problems found during that review were corrected before this run.

## Limits

Tests ran in Chromium, not on a physical iPhone or native Safari. Browser network navigation is restricted in the test environment: local production scripts/styles/portrait bytes were inlined into the test document, with a clearly isolated in-memory Storage adapter. This does not establish native Safari persistence or live-network behavior. GitHub Pages deployment status is checked separately after merge. The generated concept images shown in the conversation are not evidence of the game's rendered appearance.
