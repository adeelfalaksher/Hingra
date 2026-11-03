# Benchback product and implementation review
Review date: 3 November 2026. Status: revised build requirements, not an implemented product.

## Decision
Continue with a refined Benchback rather than the rejected anatomy lesson. This is a bounded product decision, not a prediction of winning. No user study, judge endorsement, or physical-glasses validation has taken place.

Benchback is for someone dismantling and reassembling a small household object who needs to remember which part group came from which region and where it was stored. A recorded group is a user-authored note. It never verifies that a physical part was found or fitted.

## Current evidence against the judging criteria
| Criterion | Observed evidence | Current gap | Release gate |
| --- | --- | --- | --- |
| Design | A spatial source/tray workflow is documented | No implemented Benchback workflow; input effort unmeasured | Complete a new job, interrupt/resume it, correct a mistake, and finish through visible controls |
| Technical implementation | Lens Studio 5.24.1 installed; native MCP connection succeeded | Latest authorization check was false; project is still the default Snapchat project | Authorized CLAD build, SPECS setup, zero native compile errors, native preview and LEAF evidence |
| Innovation/idea | Two-location records, reconciliation and recovery are a specific product approach | AR reassembly guidance and physical screw mats already exist | Demonstrate the actual convenience of this particular workflow; avoid first-ever claims |
| Presentation | Original concept transcript and submission rules reviewed | No Benchback working-preview video exists | Show an empty job becoming real user-entered records, recovery and completion in under three minutes |

The four official criteria are equally weighted. A stronger pitch cannot substitute for a working Lens.

## Problems found and required refinements
| Finding | Consequence | Revised requirement |
| --- | --- | --- |
| Session-only data | Closing a Lens loses repair notes exactly when they may be needed | Save committed records, counts and recovery information locally at each accepted change |
| Reusing old world coordinates after restart | Notes could point to the wrong physical locations | Resume into an alignment gate; do not show actionable location guidance until the user aligns the workspace |
| Strict last-in-first-out completion | Real reassembly may follow branches or a different order | Suggest the latest outstanding group; permit explicit selection of another pending group |
| Every group requires metadata editing | Frequent interruptions can outweigh the benefit | Default to one part; make type, quantity and length optional adjustments; no mandatory keyboard |
| Screw-hole precision implied by repair language | Desktop preview cannot establish millimeter registration | Mark source regions and part groups; do not claim precise hole identification |
| Count completion presented as physical verification | A mistaken confirmation could appear authoritative | Say user-confirmed return; keep Undo visible and reject stale or duplicate action events |
| Storage failure silently treated as success | A user might rely on notes that were never saved | Surface a save failure and keep the previous valid checkpoint; never show Saved without readback |
| Corrupt or unsupported saved data | Silently clearing it could lose a repair job | Validate schema and invariants, try the previous checkpoint, and show recovery status |
| Repeated or stale input | One physical gesture may decrement more than once | One action token per accepted intent; validate selected group and expected state revision |

## Refined core workflow
1. First launch starts empty. Place the workspace beside the task.
2. Start a record, position source and tray handles, and record it. One part is the default; optionally change kind, count or an explicitly measured length.
3. Committed records save locally. Source/tray locations are workspace-relative.
4. Start returning. The latest pending group is suggested, and only the selected pair is emphasized.
5. To use another sequence, explicitly select another pending group, inspect its stored details, and confirm it as the active return group.
6. Confirm one piece at a time. Counts reflect user input; no installation detection is implied.
7. Undo reverses a mistaken accepted operation. No completion state is possible while any recorded quantity remains outstanding.
8. After a restart, offer Resume or New job. Resume restores data, then asks the user to align the workspace before enabling return actions.
9. Starting a new job requires a clear confirmation inside the app and remains recoverable through the documented Undo window.

The quick-record flow should require no mandatory metadata-control interaction. Placement remains explicit because real camera recognition is unavailable in the required desktop preview.

## Impact and alternatives
iFixit's repair guidance documents losing screws, confusing lengths, and losing track of original locations. That validates the problem, not this Lens's effectiveness:
https://www.ifixit.com/News/31548/the-10-things-likely-to-go-wrong-when-fixing-a-phone-or-laptop

The magnetic project mat is a credible, inexpensive alternative. Benchback must earn its extra interaction cost:
https://www.ifixit.com/products/magnetic-project-mat

RePairAR already explores AR reassembly guidance generated from disassembly video. The author institution describes that work here:
https://thfl.tsinghua.edu.cn/info/1046/2672.htm
Do not claim to have invented AR repair guidance.

A furniture-clearance planner remains viable, but it also needs manual geometry input and unproven physical registration. Camera hazard detection and automatic repair recognition would depend on sensing that cannot be demonstrated faithfully in desktop preview. These alternatives do not currently justify another pivot.

## Engineering feasibility
Snap documents PersistentStorageSystem.store for data across Lens sessions:
https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.PersistentStorageSystem.html
GeneralDataStore supports strings for a versioned JSON checkpoint:
https://developers.snap.com/lens-studio/api/lens-scripting/classes/Built-In.GeneralDataStore
This supports a feasible implementation plan. It is not evidence that Benchback persistence already works.

Spatial-anchor recovery is a different capability:
https://developers.snap.com/spectacles/about-spectacles-features/apis/spatial-anchors
Do not equate saved ledger coordinates with successful physical relocalization. For this build, explicit manual workspace alignment is the required recovery path.

## Design references
Reviewed two Mobbin references as interaction examples, not AR layouts:
- Google Calendar task detail: one clear completion action and sparse task details:
  https://mobbin.com/screens/eb8f7725-f37c-4861-ab4d-22fbca683ef2
- Cursor task progress: explicit current versus incomplete status:
  https://mobbin.com/screens/602fdbe4-f8a4-4edd-94ec-39e4daf15b2f
Use a small contextual current-group card. Do not copy a phone screen into the user's field of view.

## Verification and claim limits
No Benchback application code or native scenarios have been executed yet. Hingra's historical test passes do not validate this replacement.
A scripted preview session can establish logic, visible controls, recovery behavior and recorded transforms. It cannot establish real-world anchor accuracy, physical hand-tracking quality, comfort over time, repair-time savings or reduced errors.
A small comparative repair task with real users would be needed to assess convenience against a mat or phone notes. Do not label an agent's scripted run a user study.
Final entry submission and video/gallery publishing remain held for the user's review of the working replacement.

## Sources for the challenge decision
https://learn-specs.devpost.com/
https://learn-specs.devpost.com/rules
https://learn-specs.devpost.com/resources
Original concept-video captions were retrieved and read completely in the prior review. This is not a claim that its visual content was watched.
