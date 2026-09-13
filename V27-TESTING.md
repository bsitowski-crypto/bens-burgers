# Ben's Burgers v27 — upgrade shop

## Implemented

A new game starts with $0, a bun base, raw patty, bun top, one usable burner, and one customer. All other ingredients, three additional burners, the fryer, cola fountain, and diner expansions are separate one-time purchases using fictional earnings. No payments, checkout, or real-money purchase is involved. Unlocked ingredients have unlimited stock.

The SHOP button is in the header. Locked equipment also opens the shop. Purchase eligibility checks balance, ownership, prerequisite equipment, and expansion milestones. Cash uses integer cents. Existing orders never change when something is purchased. New tickets and their ingredient pictures use only the unlocked menu. Expansion takes effect on the next shift.

Cash, purchased items, active orders, cooking jobs, and shift progress are serialized to localStorage in this browser. There is no cloud or cross-device save. Clear browser data to reset. Browser storage errors show a warning. Other-tab changes pause this tab instead of overwriting a newer save.

Portraits now retain square atlas cells inside measured stage bounds. Lou/Maya silhouette masks reduce crop artifacts. The character approaches from the left over 1.4 seconds with gentle step motion; the ticket appears afterward and patience starts only after arrival. Served customers settle briefly and move away. This is 2D portrait motion behind the counter, not a newly drawn full-body walking animation. Reduced-motion preferences are respected.

## Verification completed before publication

- JavaScript syntax checks passed for v27-model.js and v27-ui.js.
- `node v27-model.test.cjs`: 36 passing test groups, including all 128 combinations of topping unlocks, all unlocked recipes with every sides combination, affordability, exact/duplicate deductions, prerequisites, save/restore, unchanged existing tickets, burger assembly, burning, pause, serving, and customer-bound side jobs.
- Chromium/Playwright exercised touch controls to complete the first five-order shift, earn the initial cheese upgrade, buy it once, verify the next customer can request cheese, restore a saved order, and open/close the shop from both gameplay and the summary.
- Additional browser checks exercised all ingredient/equipment purchases, deferred expansion, cooking paused in the shop, duplicate-serving rejection, and UI synchronization.
- Game and shop layout checks passed at 926x355, 926x428, 844x390, 812x375, 740x320, 667x300, 1024x768, 1440x900, 390x844, and 430x932. Serve remained visible, customer boxes stayed square within the stage, no horizontal overflow was detected, and visible button-center taps were not intercepted by another element.
- Synthetic 44px left/right and 21px bottom safe areas passed at 926x355. Landscape game/shop and portrait screenshots were inspected.
- No JavaScript page errors were recorded in the completed browser suite.
- Uploaded HTML/CSS/JavaScript Git blob hashes were compared with the tested local files and matched.

## Limits

Chromium mobile emulation, not a physical iPhone or Safari. Network navigation was unavailable in the test browser, so the exact local scripts/styles were loaded into an isolated test document and the existing portrait bytes were embedded. The save/restore browser scenario used an in-memory Storage stand-in across fresh test documents; model serialization was also tested directly. Native Safari storage persistence and live network loading are separate from these local checks. Deployment success is verified separately through GitHub Pages.
