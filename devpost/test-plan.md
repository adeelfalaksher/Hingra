# Hingra preview test plan

Names below were verified in the authored scene or application source. Initial text and anatomy appearance were also inspected in a native Lens Studio preview capture.

| Object | Component / property | Expected initial condition |
|---|---|---|
| HingraController | HingraMain.phase / placedCount | assemble / 0 |
| HingraHumerus | SIK Interactable; centred source mesh | Selectable amber upper-arm bone |
| HingraUlna | SIK Interactable; centred source mesh | Selectable teal forearm bone |
| HingraRadius | SIK Interactable; centred source mesh | Selectable coral forearm bone |
| HingraForearm | Transform | Shared pivot for radius and ulna |
| HingraPrompt | Component.Text.text | Select the upper arm bone. |
| HingraProgress | Component.Text.text | ASSEMBLE 0 / 3 |
| HingraLegend | Component.Text.text | Three bone names and colour cues |
| HingraFeedback | Component.Text.text | Instructions for choosing a bone |
| HingraFlexionSlider | UI Kit Slider | Hidden until assembly completes |
| HingraPrimaryAction | UI Kit Button / SIK Interactable | Restart |
| HingraActionLabel | Component.Text.text | Restart |
| HingraAngle | Component.Text.text | Movement unlocks after assembly |
| HingraTitle | Component.Text.text | HINGRA |

## Automated coverage

- Assembly: wrong-selection guard, one-step progression, movement into the assembled position, and slider unlock.
- Movement: a SIK drag changes flexion and the forearm rotation while the humerus remains fixed.
- Recall: labels and colour cues are hidden; first-try scoring survives correction of a wrong answer.
- Restart: a partially completed recall returns to initial assembly and clears the result.
- IK input: an IK-driven press resets a changed lesson state, with simulated-input fallback disabled. The actual input route must be reported.
- Negative control: a deliberately wrong title expectation must fail. Remove this temporary scenario from the final registered suite after proving the harness.

Each scenario drives SIK input. Assertions read public state and visible text; they do not call lesson state mutation methods.

## Evidence status

Four pure lesson-state tests and all five functional LEAF scenarios passed. The negative control failed on the intended title assertion and was then removed from the final suite. The final native project compiles and renders. See validation.md and validation-evidence.txt for results. The observed IK route was far-field, with fallback disabled.

Physical-glasses comfort, real hand tracking, and direct-touch reach are not established by desktop preview tests.
