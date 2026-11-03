import test from "node:test";
import assert from "node:assert/strict";
import { HingraState } from "../Assets/Scripts/HingraState.ts";

function assembled() {
  const state = new HingraState();
  ["Humerus", "Ulna", "Radius"].forEach(bone => state.select(bone));
  return state;
}
test("wrong bone is recoverable and does not advance assembly", () => {
  const s = new HingraState();
  assert.equal(s.select("Radius"), false);
  assert.equal(s.snapshot().placed.length, 0);
  assert.equal(s.select("Humerus"), true);
  assert.deepEqual(s.snapshot().placed, ["Humerus"]);
  assert.equal(s.select("Humerus"), false);
  assert.equal(s.snapshot().placed.length, 1);
});
test("three distinct correct bones unlock movement and clamp its range", () => {
  const s = assembled();
  assert.equal(s.snapshot().phase, "explore");
  s.setFlexion(999);
  assert.equal(s.snapshot().flexion, 120);
  s.setFlexion(-1);
  assert.equal(s.snapshot().flexion, 0);
});
test("recall measures first-attempt accuracy and reset clears state", () => {
  const s = assembled();
  s.startRecall();
  assert.equal(s.select("Ulna"), false);
  assert.equal(s.select("Radius"), true);
  assert.equal(s.select("Humerus"), true);
  assert.equal(s.select("Ulna"), true);
  assert.equal(s.snapshot().phase, "complete");
  assert.equal(s.snapshot().score, 2);
  s.reset();
  assert.equal(s.snapshot().phase, "assemble");
  assert.equal(s.snapshot().score, 0);
  assert.deepEqual(s.snapshot().placed, []);
  assert.equal(s.snapshot().flexion, 0);
});
test("recall cannot start before the model is assembled", () => {
  const s = new HingraState();
  s.startRecall();
  assert.equal(s.snapshot().phase, "assemble");
  s.setFlexion(60);
  assert.equal(s.snapshot().flexion, 0);
});
