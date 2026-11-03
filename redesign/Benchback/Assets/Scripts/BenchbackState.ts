// Owns the job, draft, sequence, undo and stale-intent guards. No scene/UI access.
import { clone, draft, emptyLedger, latest, MAX_GROUPS, MAX_UNDO, pending, point, validateSavedJob } from "./BenchbackTypes";
import type { Draft, Ledger, SavedJob } from "./BenchbackTypes";
export type Intent = { action: string; revision: number; token: string; groupId?: number; data?: unknown };
export type Outcome = { ok: boolean; persist: boolean; message: string };
export class BenchbackState {
  private ledger: Ledger = emptyLedger();
  private undo: Ledger[] = [];
  private draftValue: Draft | null = null;
  private alignedValue = true;
  private revisionValue = 0;
  private tokens: string[] = [];
  constructor(saved?: unknown) {
    if (saved !== undefined) {
      const value = validateSavedJob(saved);
      this.ledger = value.current; this.undo = value.undo; this.alignedValue = false;
    }
  }
  get revision(): number { return this.revisionValue; }
  get aligned(): boolean { return this.alignedValue; }
  get view() { return { ledger: clone(this.ledger), draft: clone(this.draftValue), aligned: this.alignedValue, revision: this.revisionValue, outstanding: pending(this.ledger), canUndo: this.undo.length > 0 }; }
  exportJob(): SavedJob { return clone({ current: this.ledger, undo: this.undo }); }
  dispatch(intent: Intent): Outcome {
    if (intent.revision !== this.revisionValue || typeof intent.token !== "string" || !intent.token || intent.token.length > 100 || this.tokens.indexOf(intent.token) >= 0) return { ok: false, persist: false, message: "That action is stale. Try the current control." };
    const before = clone(this.ledger), beforeDraft = clone(this.draftValue), beforeAligned = this.alignedValue, beforeUndo = clone(this.undo);
    try {
      const result = this.perform(intent);
      if (result.history) { this.undo.push(before); if (this.undo.length > MAX_UNDO) this.undo.shift(); }
      this.revisionValue++;
      this.tokens.push(intent.token); if (this.tokens.length > 64) this.tokens.shift();
      return { ok: true, persist: result.persist, message: result.message };
    } catch (e) {
      this.ledger = before; this.draftValue = beforeDraft; this.alignedValue = beforeAligned; this.undo = beforeUndo;
      return { ok: false, persist: false, message: e instanceof Error ? e.message : String(e) };
    }
  }
  private requireAligned() { if (!this.alignedValue) throw new Error("Align the workspace before using saved locations"); }
  private perform(i: Intent): { persist: boolean; history: boolean; message: string } {
    const result = (message: string, persist = false, history = false) => ({ message, persist, history });
    switch (i.action) {
      case "align":
        this.alignedValue = true;
        return result("Workspace alignment confirmed");
      case "add":
        this.requireAligned();
        if (this.ledger.phase !== "recording" || this.draftValue) throw new Error("Finish the current action first");
        if (this.ledger.groups.length >= MAX_GROUPS) throw new Error("This job holds up to 32 groups");
        this.draftValue = { kind: "Part", quantity: 1, lengthMm: null, source: {x:-16,y:0,z:0}, tray:{x:16,y:0,z:0} };
        return result("Move amber to source, teal to tray");
      case "cancel":
        if (!this.draftValue) throw new Error("No draft to cancel");
        this.draftValue = null;
        return result("Draft cancelled");
      case "kind":
        this.needDraft();
        this.draftValue!.kind = this.draftValue!.kind === "Part" ? "Screw" : this.draftValue!.kind === "Screw" ? "Clip" : "Part";
        return result("Part kind changed");
      case "plus":
      case "minus":
        this.needDraft();
        const amount = this.draftValue!.quantity + (i.action === "plus" ? 1 : -1);
        if (amount < 1 || amount > 99) throw new Error("Quantity must be 1 to 99");
        this.draftValue!.quantity = amount;
        return result("Quantity changed");
      case "length":
        this.needDraft();
        this.draftValue!.lengthMm = this.draftValue!.lengthMm === null ? 1 : this.draftValue!.lengthMm! >= 20 ? null : this.draftValue!.lengthMm! + 0.5;
        return result("Length is user-entered, not measured by Benchback");
      case "save":
        this.requireAligned(); this.needDraft();
        const locations = i.data as { source?: unknown; tray?: unknown } | undefined;
        if (!locations) throw new Error("Source and tray locations are required");
        const entry = draft({ ...this.draftValue!, source: point(locations.source), tray: point(locations.tray) });
        this.ledger.groups.push({ id: this.ledger.nextId++, returned: 0, ...entry });
        this.ledger.reviewedId = this.ledger.groups[this.ledger.groups.length-1].id;
        this.draftValue = null;
        return result("Group recorded", true, true);
      case "return":
        this.requireAligned();
        if (this.draftValue || this.ledger.phase !== "recording" || !pending(this.ledger)) throw new Error("Record a group before starting return");
        this.ledger.phase = "returning"; this.ledger.activeId = latest(this.ledger); this.ledger.reviewedId = this.ledger.activeId;
        return result("Return the highlighted group", true, true);
      case "recordMore":
        this.requireAligned();
        if (this.draftValue || this.ledger.phase === "recording") throw new Error("Already recording");
        this.ledger.phase = "recording"; this.ledger.activeId = null;
        return result("Recording resumed; existing counts kept", true, true);
      case "review":
        if (!this.ledger.groups.length || this.draftValue) throw new Error("No saved groups to review");
        const current = this.ledger.groups.findIndex(g => g.id === this.ledger.reviewedId);
        this.ledger.reviewedId = this.ledger.groups[(current + 1) % this.ledger.groups.length].id;
        return result("Review only. Counts unchanged.");
      case "activate":
        this.requireAligned();
        if (this.ledger.phase !== "returning" || this.draftValue) throw new Error("Start return first");
        const chosen = this.ledger.groups.find(g => g.id === i.groupId);
        if (!chosen || chosen.id !== this.ledger.reviewedId || chosen.returned === chosen.quantity) throw new Error("Choose a pending reviewed group");
        this.ledger.activeId = chosen.id;
        return result("Reviewed group activated", true, true);
      case "confirm":
        this.requireAligned();
        if (this.ledger.phase !== "returning" || this.draftValue || i.groupId !== this.ledger.activeId || this.ledger.reviewedId !== this.ledger.activeId) throw new Error("Focus and check the active group before confirming");
        const active = this.ledger.groups.find(g => g.id === this.ledger.activeId);
        if (!active || active.returned >= active.quantity) throw new Error("This group has no outstanding pieces");
        active.returned++;
        if (active.returned === active.quantity) {
          this.ledger.activeId = latest(this.ledger); this.ledger.reviewedId = this.ledger.activeId;
        }
        if (pending(this.ledger) === 0) this.ledger.phase = "complete";
        return result(this.ledger.phase === "complete" ? "All recorded pieces user-confirmed" : "One piece user-confirmed returned", true, true);
      case "focus":
        this.ledger.reviewedId = this.ledger.activeId;
        return result("Active group focused");
      case "undo":
        if (!this.undo.length) throw new Error("Nothing to undo");
        const restored = this.undo.pop()!;
        if (!this.ledger.groups.length && restored.groups.length) this.alignedValue = false;
        this.ledger = restored; this.draftValue = null;
        return result("Previous operation restored", true);
      case "reset":
        if (i.data !== true) throw new Error("Confirm New job first");
        this.ledger = emptyLedger(); this.draftValue = null; this.alignedValue = true;
        return result("New empty job started", true, true);
      default: throw new Error("Unknown action");
    }
  }
  private needDraft() { if (!this.draftValue) throw new Error("Start a new group first"); }
}
