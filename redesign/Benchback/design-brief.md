---
status: draft
decision_source: assistant defaults under the user's explicit redesign and autonomous-build instruction
---

# Design brief: Benchback

The user rejected Hingra's anatomy lesson and requested a useful, impactful, fully working AR app, deeper challenge research, Lens Studio 5.24.1, and matching GitHub changes. All product choices below are assistant defaults, awaiting the user's review. No interview or approval is claimed.

## The one spatial moment
While taking an object apart, the user marks where a part group came from and where they placed it. When putting it back together, Benchback points from the saved tray location to the saved source region and keeps a count until every recorded piece has been explicitly user-confirmed as returned. Committed progress saves locally; after reopening, the user must align the workspace before spatial return actions are enabled. (default)

## Why it belongs on glasses
- Uses: draws in the world; leaves the user's hands available between brief pinch interactions.
- Source and tray markers remain next to the physical locations being recorded. The current return cue connects those locations at task scale.
- The user can keep looking at the work rather than repeatedly consulting a phone, drawing a map, or remembering which pile belongs to which step.
- No camera recognition is claimed. Pointing and dragging are explicit spatial input.

## Product or overlay
- Type: a spatial organization tool over the user's own workspace. (default)
- What it senses: standard tracked SIK selection and manipulation transforms.
- Preview stand-in: an optional neutral virtual work surface provides placement context. The ledger itself starts empty and all part records are created through user input. Recognition is not simulated.
- Return completion means user-confirmed bookkeeping, not detection that a physical part was installed.

## Where things live
- Workspace: approximately (0, -12, -115) cm, with a 54 by 36 cm working footprint. Movable as one semantic root. (default)
- Draft source and tray handles: opposite sides of the workspace, each with a 6 cm interaction target; user moves both before recording. (default)
- Focused group: only the selected source/tray pair is emphasized; inactive history recedes.
- Context card: beside/above the current task, approximately 28 cm wide, no permanent face-locked dashboard. Draft details may temporarily need a taller card. (default)
- Fine text stays around 1 m away. All placement is checked in the actual preview and adjusted after capture.
- Relative positions belong to the workspace so repositioning it moves the notes together.

## Hands and input
- Create a group: one large UIKit action starts a draft.
- Mark source and tray: grab/drag two ordinary SIK manipulation handles.
- Choose part kind: cycle Screw / Clip / Part. (default)
- Quick recording defaults to one part and requires no metadata editing. Optional quantity uses large minus/plus controls, bounded 1 to 99. Source regions represent part groups, not millimeter-accurate screw-hole identification. (default)
- Optional screw length: explicit user-entered value; unknown stays labeled unmeasured. No inferred screw identification.
- Commit/cancel: explicit UIKit controls.
- Return mode: suggest the latest pending group. The user may explicitly activate another pending group, inspect its saved details, and confirm one returned piece at a time. Reviewing a group alone cannot change counts. Stale action tokens or state revisions cannot decrement another group.
- Undo: restore the previous committed record, return count, or reset.
- Reset/new session: explicit in-app confirmation and recovery through Undo. Accepted changes save locally; a visible save error must not be presented as saved progress.
- Targets highlight when aimed at. No custom hand gesture or voice dependency.

## When things show
- First launch starts empty. If valid saved data exists, offer Resume or New job. Resume restores data into an alignment gate before enabling location guidance or return confirmation.
- Empty session: short first-use instructions and one primary action.
- Draft: only the two placement handles and relevant part/count details are emphasized.
- Recording: compact pending count and Add group / Start return actions.
- Returning: current tray/source cue, remaining quantity, Confirm returned, and Undo.
- Reviewing an older group: visibly review-only until the current pending group is focused.
- Complete: confirmation that all recorded counts are reconciled, with an explicit new-session action.
- Out-of-view target: a restrained direction hint and short cue, without a wall of persistent labels. (default)
- Save/recovery: show Saved only after readback; recover the previous valid checkpoint when available. Unsupported or corrupt data must produce a visible recovery state rather than silent erasure.

## Done criteria
Each criterion must be checked in native Lens Studio Interactive Preview.
1. A fresh session contains zero part records. User input creates multiple groups with independently moved source/tray positions and different quantities; reopening the draft or reviewing a group displays the actual saved values.
2. Invalid quantities/coordinates, empty return, accidental overlapping source/tray markers, and commit outside draft are rejected without corrupting the ledger.
3. Return mode suggests the latest pending group and guides between its saved locations. Reviewing alone does not change the active group. Explicitly activating another pending group changes the sequence; each valid confirmation decrements exactly one piece from that active group. Duplicate/stale intents are rejected.
4. Returning pieces suggests the latest remaining group and only completes when the total outstanding count is zero. Undo restores the exact previous group/count/phase, including an explicit sequence change.
5. Moving the workspace preserves each saved relative location; starting a new job requires confirmation, clears the ledger, and Undo can recover it.
6. A native Lens reset/reopen restores committed data and counts. Spatial return actions remain disabled until workspace alignment is explicitly confirmed. Corrupt data, unsupported versions and failed storage writes are exercised and surfaced without falsely reporting success.

## Out of scope
- Physical part recognition, automatic screw-size measurement, installation verification, device-specific repair or diagnostic instructions, always-on video, online accounts, cross-device sharing, automatic physical relocalization, and millimeter-accurate screw-hole mapping.
- Local ledger persistence is in scope. Persisted coordinates alone are not persistent real-world anchors; the user aligns the workspace after resuming.
- Claims of measured repair-time savings, waste reduction, educational efficacy, or physical-glasses comfort without evidence.

## Risks and open questions
- Lens Studio 5.24.1 is installed and the native MCP is connected, but the observed account state is signed out. Complete the required sign-in step before the CLAD build.
- The fresh default project still needs SPECS target/camera/package setup through native tools after sign-in.
- Physical anchoring precision and hand-tracking feel cannot be established with desktop preview.
- User-marked locations and quantities can be wrong; the tool must retain their explicit origin and never imply computer-vision verification.
- AR repair guidance already exists; differentiation is this source/tray ledger, explicit recovery and reversible quantity reconciliation. Manual input convenience remains unmeasured. See product-review.md for the critical assessment and required release gates.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
