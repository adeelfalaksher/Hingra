# Hingra validation

Verified in Lens Studio 5.23.2 on 3 November 2026, using SPECS 27 Interactive Preview (Plane source).

## Results

| Check | Result | Evidence |
|---|---|---|
| Pure lesson-state checks | 4 passed | Node 24 test runner; wrong selection, assembly/movement bounds, first-try recall scoring/reset, early-recall guard |
| Native TypeScript | Compiled successfully | Lens Studio RecompileTypeScriptTool |
| Native rendering | Observed | Preview capture shows the UIKit lesson panel and all three source meshes |
| `hingra-assembly` | Passed | Wrong selection leaves count unchanged; correct selections move bones into place and reveal the slider |
| `hingra-movement` | Passed | SIK slider drag increases flexion and rotates the forearm; humerus position stays fixed |
| `hingra-recall` | Passed | Cues hidden, colours neutralized, wrong answer recoverable, first-try score 2/3 |
| `hingra-restart` | Passed | Partially completed recall returns to assembly with score, movement, and cues reset |
| `hingra-ik-input` | Passed | IK press changes the lesson through the real action button; simulated-input fallback explicitly disabled |
| Temporary negative control | Failed as expected | Expected wrong title `__intentional_negative_control__`, received `HINGRA` |

Native manager RUNS / PASSED / FAILED excerpts are preserved in [validation-evidence.txt](validation-evidence.txt). Each scenario was run separately. Tests read public state and visible text; all changes to the lesson came through SIK controls.

The temporary negative-control registration and script were removed after the expected failure was observed. The final suite contains five functional scenarios.

## Bounds and provenance

Native GetBoundingBox confirmed the imported mesh heights: humerus 16.9037 cm, ulna 13.6002 cm, radius 12.6068 cm. These are uniform teaching-scale meshes, not measured patient anatomy. Source hashes, transforms, and licensing are in [anatomy-assets.json](anatomy-assets.json).

## Limits

Desktop IK testing does not establish physical hand tracking, reach, or comfort on glasses. The observed IK route is recorded in the evidence file. The lesson is designed around ray/pinch selection at about 110 cm, so a far-field route is expected.

On preview resets, the LEAF editor plugin logged a skipped plugin-state-save warning. The lesson then initialized and registered the five functional scenarios; the functional runs above completed successfully.

The animation uses an approximate pivot and single flexion axis. It does not model a person's anatomy, pronation/supination, full joint mechanics, or clinical range of motion. No learning-efficacy claim is made.

The public demo video and fifteen-image presentation gallery remain pending user review. No final hackathon submission has been sent.
