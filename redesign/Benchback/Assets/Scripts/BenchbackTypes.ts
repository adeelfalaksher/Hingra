// Owns bounded ledger data and checkpoint validation; no scene or UI access.
export type Point = { x: number; y: number; z: number };
export type PartKind = "Part" | "Screw" | "Clip";
export type Group = { id: number; kind: PartKind; quantity: number; returned: number; lengthMm: number | null; source: Point; tray: Point };
export type Phase = "recording" | "returning" | "complete";
export type Ledger = { groups: Group[]; phase: Phase; activeId: number | null; reviewedId: number | null; nextId: number };
export type SavedJob = { current: Ledger; undo: Ledger[] };
export type Draft = Omit<Group, "id" | "returned">;
export const MAX_GROUPS = 32, MAX_UNDO = 20;
export function emptyLedger(): Ledger { return { groups: [], phase: "recording", activeId: null, reviewedId: null, nextId: 1 }; }
export function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid checkpoint object");
  return value as Record<string, unknown>;
}
function integer(value: unknown, lo: number, hi: number): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < lo || value > hi) throw new Error("Invalid checkpoint number");
  return value;
}
export function point(value: unknown): Point {
  const p = object(value), coords = [p.x, p.y, p.z];
  if (coords.some(v => typeof v !== "number" || !Number.isFinite(v) || Math.abs(v) > 200)) throw new Error("Location must be finite and within workspace range");
  return { x: p.x as number, y: p.y as number, z: p.z as number };
}
export function separation(a: Point, b: Point): number { return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2); }
export function draft(value: unknown): Draft {
  const d = object(value);
  if (d.kind !== "Part" && d.kind !== "Screw" && d.kind !== "Clip") throw new Error("Invalid part kind");
  const quantity = integer(d.quantity, 1, 99), source = point(d.source), tray = point(d.tray);
  if (separation(source, tray) < 8) throw new Error("Separate source and tray by at least 8 cm");
  let lengthMm: number | null = null;
  if (d.lengthMm !== null) {
    if (typeof d.lengthMm !== "number" || !Number.isFinite(d.lengthMm) || d.lengthMm < 0.5 || d.lengthMm > 50) throw new Error("Invalid measured length");
    lengthMm = d.lengthMm;
  }
  return { kind: d.kind, quantity, source, tray, lengthMm };
}
export function pending(ledger: Ledger): number { return ledger.groups.reduce((s, g) => s + g.quantity - g.returned, 0); }
export function latest(ledger: Ledger): number | null {
  for (let i = ledger.groups.length - 1; i >= 0; --i) if (ledger.groups[i].returned < ledger.groups[i].quantity) return ledger.groups[i].id;
  return null;
}
export function validateLedger(value: unknown): Ledger {
  const x = object(value);
  if (!Array.isArray(x.groups) || x.groups.length > MAX_GROUPS) throw new Error("Invalid group list");
  if (x.phase !== "recording" && x.phase !== "returning" && x.phase !== "complete") throw new Error("Invalid job phase");
  const ids: number[] = [];
  const groups = x.groups.map(raw => {
    const g = object(raw), fields = draft(g), id = integer(g.id, 1, 1000000);
    const returned = integer(g.returned, 0, fields.quantity);
    if (ids.indexOf(id) >= 0) throw new Error("Duplicate group ID");
    ids.push(id);
    return { id, returned, ...fields };
  });
  const nextId = integer(x.nextId, 1, 1000001);
  if (groups.some(g => g.id >= nextId)) throw new Error("Invalid next group ID");
  const ref = (v: unknown): number | null => {
    if (v === null) return null;
    const id = integer(v, 1, 1000000);
    if (ids.indexOf(id) < 0) throw new Error("Unknown group reference");
    return id;
  };
  const activeId = ref(x.activeId), reviewedId = ref(x.reviewedId);
  const ledger: Ledger = { groups, phase: x.phase, activeId, reviewedId, nextId };
  if (x.phase === "complete" && (!groups.length || pending(ledger) !== 0)) throw new Error("False completion checkpoint");
  if (x.phase === "returning" && (!pending(ledger) || activeId === null || !groups.some(g => g.id === activeId && g.returned < g.quantity))) throw new Error("Invalid active return group");
  return ledger;
}
export function validateSavedJob(value: unknown): SavedJob {
  const x = object(value);
  if (!Array.isArray(x.undo) || x.undo.length > MAX_UNDO) throw new Error("Invalid undo history");
  return { current: validateLedger(x.current), undo: x.undo.map(validateLedger) };
}
