# Ben's Burgers v29 — sound effects

## Implemented

Original procedural Web Audio effects: ingredient placement, meat selection and grill placement, sauce, top bun, fryer basket, cup, side collection, cooking-ready ding, customer arrival, successful serving/register chime, upgrade purchase, shift complete, gentle burned-food warning, undo and rejected taps. No background music, microphone permission, external sound files or licensed samples.

One quiet ambient loop per active station group: griddle sizzle, fryer bubbling and cola filling. Noise follows model state, fades behind informational chimes, and stops on pause, shop entry, mute, zero volume, hidden document or page exit. Completion sounds are edge-triggered and throttled rather than firing every render. Invalid serving/purchases cannot play reward cues. Audio starts only following user interaction and unsupported browsers continue silently.

A speaker button beside SHOP toggles effects. The welcome/pause/help dialog contains a sound toggle and volume slider (initial level 45%). Preferences use bens-burgers.audio.v1, separate from the unchanged bens-burgers.v27.save game progress key. Cash, upgrades, recipes, cooking rules and character artwork/motion are unchanged by this sound release. The previously requested further character-quality work is not included in v29.

## Executed validation

- node --check sound-v29.js and node --check v29-ui.js passed.
- node sound-v29.test.cjs: 20 passing sound regression cases.
- node v28-model.test.cjs: all existing 37 model/renderer cases passed.
- 23 Chromium touch-browser assertions passed: no autoplay, gesture-created running AudioContext, arrival notification, invalid input, actual patty cooking, one sizzle loop, mute/unmute, pause, volume preference, shop pause, one ready notification, successful serving, duplicate-reward rejection, simulated document hiding and AudioContext suspension, restored preferences/save, real fryer/drink start and collection, zero-volume silence, unsupported-audio fallback, and no JavaScript page errors.
- Two additional browser assertions passed: an actual upgrade purchase deducted cash and triggered its sound while kitchen loops remained paused; finished one-shot audio nodes were cleaned up.
- Native OfflineAudioContext rendered 16 effect types and 3 ambience types. All 19 produced finite, non-silent waveforms with individual peak amplitude below 0.8 at the default volume. This verifies audio is actually synthesized, not merely that cue names were logged.
- Game/header/serve controls and sound settings checked at 390x844, 430x932, 360x640, 320x568, 926x355, 844x390, 667x300 and 1440x900. No horizontal overflow or blocked/offscreen speaker/shop/pause/serve button centers. Keyboard navigation includes the new volume slider. Existing short-screen modal content can scroll; its controls remain reachable.
- Portrait gameplay and portrait/landscape pause settings screenshots were visually inspected.
- Uploaded production HTML, CSS and JS blob hashes matched the local files used in testing.

## Limits

Tests used Chromium and its actual Web Audio/OfflineAudioContext implementations, not a physical iPhone or Safari. Browser navigation was restricted, so tests ran the local production scripts/styles in an isolated document with embedded existing images and an explicit in-memory Storage adapter. Hiding the document was simulated by dispatching the actual visibility event with document.hidden set in the test. Native browser persistence, iPhone audio routing/silent-switch behavior, and physical-speaker listening were not verified. Audio output was rendered and measured, not auditioned through a physical device. Deployment is checked separately through GitHub Pages.

## Implementation reference

User-gesture initialization and volume/mute controls follow MDN Web Audio best practices: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
