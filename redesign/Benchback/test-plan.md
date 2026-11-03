# Benchback verification plan

Status: planned, not executed. The new native project is saved in Lens Studio 5.24.1; required account sign-in is pending. Old Hingra test results do not validate Benchback.

## Pure ledger tests
- Create independent records with arbitrary finite source/tray coordinates, quantities, and explicit part metadata.
- Reject zero/negative/fractional/NaN/overflow quantities and non-finite coordinates without mutating saved history.
- Reject source/tray positions that cannot be separately targeted.
- Reverse traversal skips already reconciled groups, decrements one piece per confirmation, and prevents early completion.
- Reviewing the wrong group cannot confirm it as the current return step.
- Undo restores exact record metadata, counts, selected group, and phase across record/return/reset actions.
- Reset clears every group; recoverable Undo restores the session.
- Snapshots are detached copies, so view code cannot mutate state accidentally.

## Native LEAF scenarios
Run one scenario at a time through native LEAF, using actual SIK inputs. Assertions read state/text/transforms; never mutate state directly.
1. Empty session to recording: create two groups through controls, change quantity/kind/length, drag both placement handles, verify saved values.
2. Placement and input guards: attempt overlapping source/tray handles and an empty return, verify no committed record or false success.
3. Reverse reassembly: create three groups of different quantities, focus an older group and attempt confirmation, then reconcile the expected group item by item.
4. Undo and completion: undo a return at a group boundary, verify exact restoration, then complete all groups and inspect the remaining total.
5. Workspace movement: move the authored workspace through standard manipulation, verify recorded local offsets stay fixed while displayed world locations shift together.
6. Reset/recovery: clear a populated session with the visible controls, verify empty state and recover through Undo.
7. IK route: execute a changed-state action with simulated fallback disabled; report whether it was direct or far-field.

## Harness check
Temporarily assert an intentionally wrong visible title and require a native FAILED outcome on that assertion. Remove this negative-control registration/script after proving failure detection.

## Visual and runtime checks
- Native TypeScript compile and startup log check.
- Capture first-use, draft, returning, completion, and movement at two timestamps.
- Verify minimum target size, text contrast, no UI/model overlap, and a usable field of view.
- Verify no recognition simulation, canned part records, fabricated physical verification, or hidden paid-service dependency.
- Check mesh/material/texture counts and a bounded performance sample.
- Distinguish software behavior verified in desktop preview from physical SPECS comfort/hand tracking/anchor precision, which remain unproven.

## Publication gate
Replace GitHub main and the old Devpost story only after the new working source and native evidence agree. Preserve Hingra in Git history. Keep video/gallery production and final hackathon submission under the existing user-review gate.
