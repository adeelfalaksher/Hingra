/** Owns lesson progression and recall accuracy. Pure logic; never accesses scene or UI. */
export type BoneName = "Humerus" | "Ulna" | "Radius";
export type LessonPhase = "assemble" | "explore" | "recall" | "complete";
export type LessonView = {
  phase: LessonPhase; placed: BoneName[]; progress: string; prompt: string;
  feedback: string; score: number; flexion: number; action: string;
};
const ORDER: BoneName[] = ["Humerus", "Ulna", "Radius"];
const ASSEMBLY = [
  "Select the upper arm bone.",
  "Select the forearm bone on the little-finger side.",
  "Select the forearm bone on the thumb side.",
];
const RECALL: {answer: BoneName; prompt: string}[] = [
  {answer: "Radius", prompt: "Which forearm bone is on the thumb side?"},
  {answer: "Humerus", prompt: "Which bone forms the upper arm?"},
  {answer: "Ulna", prompt: "Which forearm bone is on the little-finger side?"},
];
export class HingraState {
  private phase: LessonPhase = "assemble";
  private placed: BoneName[] = [];
  private question = 0;
  private attempts = 0;
  private score = 0;
  private flexion = 0;
  private feedback = "Pinch a bone to choose it. You can look around the model.";

  select(bone: BoneName): boolean {
    if (this.phase === "assemble") {
      if (bone !== ORDER[this.placed.length]) {
        this.feedback = "Try another bone. The upper arm joins two forearm bones.";
        return false;
      }
      this.placed.push(bone);
      this.feedback = bone + " placed.";
      if (this.placed.length === ORDER.length) {
        this.phase = "explore";
        this.feedback = "The elbow is assembled. Bend the forearm with the slider.";
      }
      return true;
    }
    if (this.phase === "recall") {
      if (bone !== RECALL[this.question].answer) {
        this.attempts++;
        this.feedback = "Try again. Think about its place in the arm.";
        return false;
      }
      if (this.attempts === 0) this.score++;
      this.question++;
      this.attempts = 0;
      this.feedback = "Correct.";
      if (this.question === RECALL.length) {
        this.phase = "complete";
        this.feedback = "First-try answers: " + this.score + " of 3. Practice again whenever you like.";
      }
      return true;
    }
    this.feedback = bone + (bone === "Humerus" ? ": upper arm." : bone === "Radius" ? ": thumb-side forearm." : ": little-finger-side forearm.");
    return false;
  }
  setFlexion(degrees: number): void {
    if (this.phase !== "explore") return;
    this.flexion = Math.max(0, Math.min(120, Number.isFinite(degrees) ? degrees : 0));
  }
  startRecall(): void {
    if (this.phase !== "explore") return;
    this.phase = "recall";
    this.question = 0; this.attempts = 0; this.score = 0; this.flexion = 0;
    this.feedback = "Bone labels are hidden. Choose directly on the model.";
  }
  reset(): void {
    this.phase = "assemble"; this.placed = []; this.question = 0;
    this.attempts = 0; this.score = 0; this.flexion = 0;
    this.feedback = "Pinch a bone to choose it. You can look around the model.";
  }
  snapshot(): LessonView {
    const progress = this.phase === "assemble" ? "ASSEMBLE  " + this.placed.length + " / 3"
      : this.phase === "explore" ? "EXPLORE"
      : this.phase === "recall" ? "RECALL  " + (this.question + 1) + " / 3" : "LESSON COMPLETE";
    const prompt = this.phase === "assemble" ? ASSEMBLY[this.placed.length]
      : this.phase === "explore" ? "Bend the elbow. The two forearm bones move together."
      : this.phase === "recall" ? RECALL[this.question].prompt : "You have built, moved, and identified the elbow.";
    return {phase:this.phase, placed:this.placed.slice(), progress, prompt,
      feedback:this.feedback, score:this.score, flexion:this.flexion,
      action:this.phase === "explore" ? "Test recall" : "Restart"};
  }
}
