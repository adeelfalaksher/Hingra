// Owns versioned two-slot local checkpoints. No physical-anchor or UI claims.
import { validateSavedJob } from "./BenchbackTypes";
import type { SavedJob } from "./BenchbackTypes";
export interface StringStore { getString(key: string): string; putString(key: string, value: string): void; }
export type LoadResult = { status: "empty" | "ready" | "recovered" | "blocked"; job: SavedJob | null; message: string };
type Checkpoint = { version: number; sequence: number; payload: string; checksum: string };
function checksum(text: string): string {
  let h = 2166136261;
  for (let i=0; i<text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h,16777619); }
  return (h>>>0).toString(16);
}
const MAX_BYTES = 512000;
export class BenchbackStorage {
  private sequence = 0;
  private newestSlot = -1;
  private store: StringStore;
  private namespace: string;
  constructor(store: StringStore, namespace = "benchback.job.v1") { this.store = store; this.namespace = namespace; }
  private key(slot: number) { return this.namespace + "." + slot; }
  private decode(raw: string): { sequence: number; job: SavedJob } {
    if (raw.length > MAX_BYTES) throw new Error("Checkpoint is too large");
    const c = JSON.parse(raw) as Checkpoint;
    if (!c || c.version !== 1 || !Number.isSafeInteger(c.sequence) || c.sequence < 1 || typeof c.payload !== "string" || c.payload.length > MAX_BYTES || c.checksum !== checksum(c.payload)) throw new Error("Unsupported or damaged checkpoint");
    return { sequence: c.sequence, job: validateSavedJob(JSON.parse(c.payload)) };
  }
  load(): LoadResult {
    const valid: { sequence: number; job: SavedJob; slot: number }[] = [];
    let present = false, invalid = false;
    for (let slot=0; slot<2; slot++) {
      try {
        const raw = this.store.getString(this.key(slot));
        if (!raw) continue;
        present = true;
        const c = this.decode(raw); valid.push({ ...c, slot });
      } catch (e) { invalid = true; }
    }
    valid.sort((a,b) => b.sequence-a.sequence);
    if (!valid.length) return {status:present || invalid ? "blocked" : "empty",job:null,message:present || invalid ? "Saved data could not be read. Start a new job only if you want to replace it." : "No saved job"};
    const newest = valid[0]; this.sequence = newest.sequence; this.newestSlot = newest.slot;
    return {status:invalid ? "recovered" : "ready",job:newest.job,message:invalid ? "Recovered the previous valid checkpoint. Some recent changes may be missing." : "Saved job found"};
  }
  save(job: SavedJob): { ok: boolean; message: string } {
    try {
      const safe = validateSavedJob(job), payload = JSON.stringify(safe);
      const sequence = this.sequence+1;
      if (!Number.isSafeInteger(sequence) || payload.length > MAX_BYTES) throw new Error("Job storage limit reached");
      const text = JSON.stringify({version:1,sequence,payload,checksum:checksum(payload)});
      if (text.length > MAX_BYTES) throw new Error("Job storage limit reached");
      const slot = this.newestSlot === 0 ? 1 : 0;
      this.store.putString(this.key(slot),text);
      const readback = this.store.getString(this.key(slot));
      if (readback !== text) throw new Error("Checkpoint readback failed");
      this.decode(readback);
      this.sequence = sequence; this.newestSlot = slot;
      return {ok:true,message:"Saved locally"};
    } catch (e) { return {ok:false,message:"Save failed. Progress may not survive closing. " + (e instanceof Error ? e.message : String(e))}; }
  }
}
