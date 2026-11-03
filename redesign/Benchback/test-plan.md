# Benchback verification plan

Status: required checks, not executed. Benchback's fresh native project is saved in Lens Studio 5.24.1. The latest account check was signed out; the actual Snapchat login screen is now open for the user. Old Hingra test results do not validate Benchback.

## Pure ledger and recovery tests
- Create independent groups with arbitrary finite source/tray coordinates and explicit optional metadata; quick record defaults to one part.
- Reject zero, negative, fractional, NaN and overflowing quantities and non-finite coordinates without mutating committed history.
- Reject overlapping source/tray handles that cannot be separately targeted.
- Suggest the latest outstanding group, allow explicit activation of another pending group, and ensure review alone cannot change the active group or counts.
- Decrement exactly one piece per accepted unique intent. Reject stale expected revision, wrong active group, repeated token and repeated completion events.
- Complete only when all outstanding counts are zero. Check quantities at group boundaries, not only one fixed example.
- Undo restores exact metadata, quantities, active/reviewed group and phase after record, return, sequence change and new-job reset.
- Snapshots are detached copies; view code cannot mutate the ledger.
- Versioned serialization round-trips state, stable IDs and all finite local coordinates.
- Reject corrupt JSON, unsupported schema versions, duplicate IDs, invalid counts, NaN/infinity and inconsistent completion states.
- Recovery chooses the latest valid checkpoint and preserves a prior valid copy if a write or readback fails. A save failure must never display Saved.
- A restored job enters the alignment gate. Confirmations remain blocked until the user confirms workspace alignment.

## Native LEAF scenarios
Run scenarios separately through native LEAF using actual SIK inputs. Assertions read state, text and transforms; they never directly advance production state. Isolate test storage from user jobs and clean up only test-owned keys.
1. Empty to quick record: create two arbitrary groups through visible controls, move both handles, vary optional count/kind/length, and inspect the saved records.
2. Input guards: attempt overlapping placements, invalid counts and empty return. No false record or completion may appear.
3. Flexible return: create three groups, verify the suggested latest group, review an older one without changing counts, explicitly activate it and return one item.
4. Duplicate/stale guards: replay an accepted action token and stale group/revision; neither may decrement any quantity.
5. Undo and completion: undo at a group boundary, verify exact restoration, then return all recorded quantities. Completion requires zero outstanding pieces.
6. Workspace movement: move the workspace using standard manipulation; saved local offsets remain fixed while displayed world locations move together.
7. New job and recovery: cancel a new-job confirmation, then accept it, verify empty state and recover through Undo.
8. Persistent resume: record and partially return groups, reset the Lens, resume actual saved data and inspect exact counts/metadata. Spatial return actions stay disabled before alignment confirmation and work after alignment.
9. Storage/recovery failures: inject faults only into test-owned storage; verify visible failure status, previous-checkpoint recovery and no silent loss or false Saved state.
10. Input route: perform a changed-state action with simulated fallback disabled. Report the actual direct/far-field route rather than assuming it.

## Harness check
Temporarily assert an intentionally wrong visible title. Require a native FAILED outcome on that assertion, then remove the negative-control registration. A test registration or a completed tool call is not proof of a passing scenario; read the scenario's final assertion result.

## Native and visual release checks
- Zero native TypeScript compile errors and no unresolved startup/runtime exceptions.
- Capture first use, draft, return, resume alignment, recovery error and completion. Inspect each actual frame.
- Check target sizes, bright readable text, overlap, current-group emphasis and usability after moving the preview viewpoint.
- Record the exact control actions and mandatory metadata interactions for a quick record. Do not report repair-time savings from this scripted measurement.
- Verify no canned part records, recognition simulation, fabricated physical verification or hidden paid dependency.
- Sample native runtime performance and report observed values; do not invent an FPS target result or equate desktop performance with physical SPECS performance.
- Exercise a fresh install and an existing saved job, including reset/reopen. Cross-reset storage behavior must be demonstrated, not inferred from serialization tests.

## Evidence boundaries
Software logic, visible controls and transforms can be checked in desktop preview. Physical SPECS comfort, real hand tracking, relocalization accuracy and comparative repair convenience remain unproven. Agent-scripted sessions are not a real-user study.

## Publication gate
Replace GitHub main and the old Devpost story only after the replacement's working source and native evidence agree. Preserve Hingra in Git history. Keep video/gallery production and final hackathon submission under the existing user-review gate.
