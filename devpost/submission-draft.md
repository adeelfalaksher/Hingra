# Hingra submission draft

Status: working draft; no final submission or video has been published.

## Project
Hingra

## Tagline
Assemble an elbow in your space, explore its movement, then test what you remember.

## Inspiration
An elbow diagram gives learners bone names, but the relationship between those bones takes more attention. Hingra turns that relationship into one small spatial task: put three bones together, bend the result, then recognize each bone without its colour cue.

## What it does
Hingra is a native SPECS lesson for people beginning anatomy. The learner selects the humerus, ulna, and radius in a guided sequence. Each correct choice joins the elbow; a wrong choice gives feedback without advancing. A slider then moves the radius and ulna together around an approximate elbow pivot. A three-question recall round hides the teaching names and colours, shuffles the bones, and reports first-try answers. Restart clears the lesson.

## How it was built
The Devpost Learn planning pack shaped the design brief and build plan in this folder. Under the user's autonomous-build instruction, concept choices are recorded as assistant defaults rather than a claimed interview or learner sign-off.

CLAD and the Lens Studio MCP tools were used with an AI coding agent to build and inspect the native project in Lens Studio 5.23.2. TypeScript owns the lesson state and native animation. Spectacles Interaction Kit handles bone selection; Spectacles UI Kit provides the lesson panel, slider, and action button. LEAF drives the actual SIK controls in preview.

The three source meshes come from BodyParts3D under CC BY 4.0. Their axes, scale, and pivots were adapted for a simplified teaching model. The Lens includes two short synthesized feedback sounds. Mobbin, Anatomy, and Templens informed design and anatomical reference; their application assets are not included.

## Challenges
The first imported LEAF package expected newer InteractionKit package names, while the selected native template used SpectaclesInteractionKit and SpectaclesUIKit. A compatible LEAF 2.0.2 package resolved the mismatch. UIKit's FlexLayout also required automatic item discovery to be disabled before explicitly adding runtime rows. An optional preview inspector brought newer incompatible SDK helpers; it was removed and testing continued through LEAF and native preview captures.

## What was learned
Native compile success is only an early checkpoint. Runtime layout, interaction callbacks, mesh scale, and state transitions need separate verification. Keeping state in one owner made it possible to inspect outcomes while tests exercised the real SIK controls. A deliberately incorrect assertion also verified that the harness reports failure.

The spatial lesson works around one model and one task. Physical SPECS testing is still needed to assess hand tracking and sustained comfort.

## Next
Review the lesson on real SPECS, refine the pivot and bone orientation with an anatomy educator, and try the recall prompts with beginning learners.

## Submission preparation
- Repository: https://github.com/adeelfalaksher900-creator/Hingra
- Technology field 29092: use the build description above.
- Build outcome field 29093: Mostly, after a few fixes.
- Specific setup and compatibility findings: see Challenges above.
- Video: awaiting user review before production. Required final demo must be public on YouTube and under 3 minutes.
- Thumbnail: prepare a 3:2 project cover.
- Fifteen-image gallery: awaiting user review before production.
- Personal eligibility declarations, prior Lens Studio experience, and subjective survey responses: leave for the user to confirm. No personal attestations are inferred.
- Final submission: held for user review.
