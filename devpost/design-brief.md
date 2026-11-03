---
status: draft
decision_source: assistant defaults under the user's autonomous-build instruction
---

# Design brief: Hingra

All concept and layout choices below are defaults proposed by the assistant. No learner interview or design approval is claimed.

## The one spatial moment
The learner assembles a right elbow in front of them, watches the forearm bend, then identifies the bones without labels. The three-dimensional relationship remains in the room while the learner looks around it. (default)

## Why it belongs on glasses
- Uses: draws in the world and leaves the learner's hands free between pinches.
- The model has depth and can be inspected from another viewpoint; learning is centered on the model rather than a large floating slide.

## Product or overlay
- Type: product; a virtual teaching model. (default)
- Senses: ordinary SIK selection input only.
- Stand-in for preview: none needed. Model anatomy is a teaching representation; no recognition, body alignment, or motion measurement is claimed.

## Where things live
- Model at approximately (-12, 0, -110) cm, about 18 cm wide and 30 cm tall. World anchored. (default)
- Instruction/control panel at approximately (13, 0, -110) cm, 23 cm wide and at most 38 cm tall. (default)
- All controls stay inside the main view with targets at least 4 cm high. No information behind the user.
- Forearm movement is a simplified flexion demonstration, not a patient-specific simulation.

## Hands and input
- Pinch/click the requested bone using standard SIK interaction.
- Use a UI Kit slider to bend the assembled forearm.
- Use a button to start recall or restart.
- Targets highlight when aimed at. Voice is not required.

## When things show
- Assembly guidance appears first; selected bones join the elbow.
- The movement control appears after all three bones are placed.
- Recall hides the instructional bone names and asks one question at a time.
- Feedback appears next to the control panel; no offscreen attention cue is required.

## Done criteria
Each criterion must be checked in Lens Studio preview.
1. A fresh run begins at assembly step one with three distinct selectable bones.
2. A wrong selection gives recoverable feedback without advancing; the requested bone advances exactly one step.
3. Three correct selections produce one assembled elbow and reveal the movement control.
4. Changing the movement slider moves the radius and ulna together around the elbow while the humerus stays fixed.
5. Recall asks three bone-identification questions, reports the result, and restart restores the initial state.

## Out of scope
- Diagnosis, rehabilitation guidance, measurement of a real person's range of motion, live camera recognition, multi-user features, or persistent accounts.
- Claims of educational efficacy or comfort on physical glasses without study or device testing.

## Risks and open questions
- Physical-glasses comfort and hand tracking remain unproven.
- Mesh licensing, import scale, pivot placement, and occlusion need verification.
- The learner has not reviewed the assistant's concept choices.

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
