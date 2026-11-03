# Benchback research and product decision
Date: 3 November 2026. Assistant decisions under the user's explicit autonomous redesign instruction. No user interview, user study, or design sign-off is claimed.

## Challenge re-review
Read: Devpost overview, full official rules, complete Resources/FAQ, judging criteria, dates, latest four announcements, the original plan-lens skill, its AR rules, preview limits, and brief template.
Original concept video: https://www.youtube.com/watch?v=S6w4aRVGQxs
The complete 262-segment English auto-generated transcript was retrieved and read (0.5s to 556.0s). Captions may contain transcription mistakes; this is transcript review, not a claim of visual video analysis.
Primary teaching: scene-centered useful work; contextual/transient information; forgiving pinch targets; preview cannot provide real-camera recognition.
All four judging criteria are equally weighted: Design, Technical Implementation, Innovation/Idea, Presentation. Deadline 9 November 2026 22:00 UTC / 10 November 03:00 Pakistan.
Submission: native SPECS Lens, required agent/CLAD/MCP workflow, public native source, English description, public YouTube working-preview video under 3 minutes.
Official rules and overview disagree on whether planning docs are mandatory; include them regardless.
No new eligibility attestations or final submission will be sent autonomously.

## Real problem
iFixit's own repair guidance identifies losing screws, confusing different screw sizes, and forgetting original locations as common repair mistakes:
https://www.ifixit.com/News/31548/the-10-things-likely-to-go-wrong-when-fixing-a-phone-or-laptop
Its project mat supports spatial part organization and notes:
https://www.ifixit.com/products/magnetic-project-mat
ITU/UNITAR's Global E-waste Monitor supports repair and refurbishment as ways to extend product lifetime:
https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-Waste-Monitor-2024.aspx
These motivate the problem. They do not establish that this Lens reduces waste, repair time, or errors.

## Alternatives considered
| Concept | Useful task | Preview dependency | Decision |
|---|---|---|---|
| Camera hazard detector | Identify dangerous objects | Real camera recognition unavailable | Reject for this build |
| Accessibility route scan | Judge a real walking route | World sensing and safety validation beyond preview | Reject |
| Furniture clearance planner | Test a carried object's fit | User-entered geometry, feasible | Viable, less focused on repair |
| AR sheet nesting | Plan use of scrap material | Real optimization feasible; precision/registration untested | Viable, crowded tooling |
| Benchback | Remember where removed parts belong | User-authored spatial records and real counts | Selected |

## Differentiation and limits
AR repair guidance already exists. RePairAR (CHI 2026, DOI 10.1145/3772318.3790494) uses video/MLLM extraction; do not claim invention of AR reassembly guidance or reproduce its pipeline.
Benchback's specific approach: an immediate spatial ledger, user-marked source and tray regions, suggested reverse-order guidance with explicit group selection, local checkpoint recovery, per-group quantity reconciliation, undo, and a completion guard. No recording, model inference, backend, or paid API is needed.
A conventional mat records positions on a 2D grid; Benchback retains both original and storage locations in the room and focuses only the current return step.

## Working behavior
Start with an empty ledger. User creates each record; no preloaded parts or canned recognition.
Drag two standard SIK handles to mark source and tray. Choose part kind, quantity, and optional screw length. Commit the step.
Return mode suggests the latest outstanding group, with explicit activation of another pending group when the user's task requires it. It highlights the actual saved tray and source region, draws a connecting cue, and reconciles explicitly user-confirmed returns one item at a time. Reviewing alone cannot change counts. Stale or duplicate actions cannot advance. Completion requires every recorded count to be zero.
Undo and new-job reset must be reversible state operations. Accepted changes must save locally. Reopening restores data into an explicit manual workspace-alignment gate; it must not pretend that saved coordinates prove successful physical relocalization. Neither persistence nor other Benchback functions have been implemented or tested yet. Physical-part detection and verification that a screw has been installed remain out of scope.
Working geometry and tests must exercise arbitrary user-created records, not just one fixed sequence.
This is an organization aid, not device-specific repair instructions or electrical/battery safety guidance.

## Design sources
https://developers.snap.com/spectacles/best-practices/design-for-spectacles/design-best-practices
https://developers.snap.com/spectacles/best-practices/design-for-spectacles/positioning-sizing-content
https://design.google/library/early-challenges-in-ar-ux
https://developer.android.com/design/ui/ai-glasses/guides/foundations/design-principles
Apply small contextual cards, transient details, low-arm effort, roughly 1m detail depth, 4-6cm targets, bright text and clear hover feedback. Physical-glasses comfort remains unproven.

## Version and continuity
Official downloaded Lens Studio 5.24.1 installer (806527680 bytes) has a valid Snap Inc. Authenticode signature.
Installer log says installation succeeded; executable reports 5.24.1. Previous 5.23.2 was replaced in place. Old Hingra source remains in Git history, local tag archive-hingra-before-pivot, and a source ZIP.
Build a fresh native project. Do not relabel the old anatomy lesson as the new experience.

## Critical refinement after user review request
See product-review.md for the four-criterion evidence table, known gaps, source-region precision limit, local save/recovery requirements, flexible reassembly order and release gates. The earlier session-only, strict-order design is superseded by that review. This is an implementation plan, not a claim of working behavior.
