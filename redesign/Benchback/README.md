# Benchback

Benchback is being built as a native SPECS tool for remembering which region a removed part group came from and where it was stored.

## Current implementation
The ledger and checkpoint-storage protocol are implemented. The actual TypeScript source passes 14 logic tests, including arbitrary records, per-piece returns, flexible group selection, duplicate/stale actions, exact Undo, recovered-job alignment, capacity limits, damaged data and failed-write/readback handling.

Storage tests use an in-memory StringStore with fault injection. Native persistent-storage behavior and the visible Lens workflow still require preview verification. These tests do not establish physical part recognition, installation verification or real-world anchor accuracy.

Lens Studio 5.24.1 is installed and signed in. SPECS target, world-tracked camera, interaction root, InteractionKit4.0.0 and UIKit4.0.0 are initialized. The package-name compatibility issue has been corrected through native APIs; native compilation and startup logs passed after that correction. Spatial UI and controller integration are in progress.

## Verify the core
Use Node.js24.15 or later. From this folder, run:

    node --test tests/ledger.test.mjs

This folder currently contains the tested core and design documents. A complete native Benchback project and native test evidence will follow after integration. The Lens files at the repository root are the historical Hingra lesson and must not be presented as Benchback.

## Design and review
- [Design brief](design-brief.md)
- [Research and challenge review](research-and-scope.md)
- [Critical product review](product-review.md)
- [Build plan](build-plan.json)
- [Verification plan](test-plan.md)

No Benchback working-preview video or final hackathon entry has been submitted.

## Native verification status
The core includes regression fixes for fresh storage adapters and confirmed replacement after read failures. Native scene and UI modules are authored, but preview text/layout visibility is still being corrected. The LEAF4 testing plugin requested filesystem, asset_library and push_to_device permissions; its broad permission prompt needs the user to approve it before plugin execution. A fully working native workflow has not yet been verified.
