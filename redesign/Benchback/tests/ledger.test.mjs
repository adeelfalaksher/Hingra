import {registerHooks} from "node:module";
import {test} from "node:test";
import assert from "node:assert/strict";
registerHooks({resolve(specifier,context,nextResolve) {
  try { return nextResolve(specifier,context); }
  catch(e) { if(e.code==="ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !specifier.endsWith(".ts")) return nextResolve(specifier+".ts",context); throw e; }
}});
const {BenchbackState}=await import("../Assets/Scripts/BenchbackState.ts");
const {BenchbackStorage}=await import("../Assets/Scripts/BenchbackStorage.ts");
const {validateSavedJob,MAX_GROUPS}=await import("../Assets/Scripts/BenchbackTypes.ts");
const pos=(x=0)=>({source:{x:-16+x,y:0,z:-3},tray:{x:16+x,y:0,z:4}});
let token=0;
function act(s,action,data,groupId){return s.dispatch({action,data,groupId,revision:s.revision,token:"test-"+(++token)});}
function ok(s,action,data,groupId){const r=act(s,action,data,groupId);assert.equal(r.ok,true,r.message);return r;}
function record(s,n=1,x=0){ok(s,"add");for(let i=1;i<n;i++)ok(s,"plus");ok(s,"save",pos(x));}
class MemoryStore { values=new Map(); fail=false; mismatch=false; getString(k){return this.values.get(k)||"";} putString(k,v){if(this.fail)throw new Error("disk full");this.values.set(k,this.mismatch?"bad":v);} }
test("starts genuinely empty; arbitrary groups preserve independent coordinates and optional metadata",()=>{
 const s=new BenchbackState();assert.equal(s.view.ledger.groups.length,0);
 record(s,3,2);ok(s,"add");ok(s,"kind");ok(s,"length");ok(s,"save",pos(-4));
 const groups=s.view.ledger.groups;assert.equal(groups[0].quantity,3);assert.equal(groups[0].source.x,-14);assert.equal(groups[1].source.x,-20);assert.equal(groups[1].kind,"Screw");assert.equal(groups[1].lengthMm,1);
 const detached=s.view;detached.ledger.groups[0].quantity=99;assert.equal(s.view.ledger.groups[0].quantity,3);
});
test("invalid placement, empty return and quantities do not alter the ledger",()=>{
 const s=new BenchbackState();assert.equal(act(s,"return").ok,false);
 ok(s,"add");assert.equal(act(s,"minus").ok,false);
 const before=s.exportJob();assert.equal(act(s,"save",{source:{x:NaN,y:0,z:0},tray:pos().tray}).ok,false);assert.deepEqual(s.exportJob(),before);
 assert.equal(act(s,"save",{source:{x:0,y:0,z:0},tray:{x:1,y:0,z:0}}).ok,false);assert.equal(s.view.ledger.groups.length,0);
});
test("suggested reverse order is flexible, review cannot change counts, wrong review cannot confirm",()=>{
 const s=new BenchbackState();record(s,2);record(s,1,3);record(s,3,-2);ok(s,"return");
 assert.equal(s.view.ledger.activeId,3);ok(s,"review");assert.equal(s.view.ledger.reviewedId,1);assert.equal(s.view.outstanding,6);
 assert.equal(act(s,"confirm",undefined,3).ok,false);ok(s,"activate",undefined,1);ok(s,"confirm",undefined,1);assert.equal(s.view.outstanding,5);assert.equal(s.view.ledger.activeId,1);
 ok(s,"confirm",undefined,1);assert.equal(s.view.ledger.activeId,3);
 while(s.view.outstanding){ok(s,"confirm",undefined,s.view.ledger.activeId);}
 assert.equal(s.view.ledger.phase,"complete");assert.equal(act(s,"confirm",undefined,3).ok,false);
});
test("duplicate/stale actions rejected and revision remains monotonic across undo/reset and ID reuse",()=>{
 const s=new BenchbackState();record(s,2);ok(s,"return");
 const i={action:"confirm",revision:s.revision,token:"one-physical-action",groupId:1};assert.equal(s.dispatch(i).ok,true);assert.equal(s.dispatch(i).ok,false);assert.equal(s.view.outstanding,1);
 const rev=s.revision;ok(s,"undo");assert.ok(s.revision>rev);assert.equal(s.view.outstanding,2);ok(s,"reset",true);record(s);ok(s,"return");assert.equal(s.dispatch(i).ok,false);assert.equal(s.view.outstanding,1);
});
test("undo restores exact operation, group boundary and new job; no false completion",()=>{
 const s=new BenchbackState();record(s);record(s,2,4);ok(s,"return");ok(s,"confirm",undefined,2);
 const prior=s.view.ledger;ok(s,"confirm",undefined,2);assert.equal(s.view.ledger.activeId,1);ok(s,"undo");assert.deepEqual(s.view.ledger,prior);
 assert.equal(act(s,"reset",false).ok,false);ok(s,"reset",true);assert.equal(s.view.ledger.groups.length,0);ok(s,"undo");assert.deepEqual(s.view.ledger,prior);
});
test("restored job blocks spatial actions until explicit alignment; saved data is detached",()=>{
 const s=new BenchbackState();record(s);ok(s,"return");const job=s.exportJob();const restored=new BenchbackState(job);
 assert.equal(restored.aligned,false);assert.equal(act(restored,"confirm",undefined,1).ok,false);assert.equal(restored.view.outstanding,1);
 ok(restored,"align");ok(restored,"confirm",undefined,1);assert.equal(restored.view.ledger.phase,"complete");assert.equal(job.current.groups[0].returned,0);
});
test("bounded capacity and arbitrary counts reconcile without early completion",()=>{
 const s=new BenchbackState();for(let j=0;j<MAX_GROUPS;j++)record(s,(j%4)+1,j/4);
 assert.equal(act(s,"add").ok,false);ok(s,"return");let steps=0;
 while(s.view.outstanding){const before=s.view.outstanding;ok(s,"confirm",undefined,s.view.ledger.activeId);steps++;assert.equal(s.view.outstanding,before-1);assert.equal(s.view.ledger.phase==="complete",s.view.outstanding===0);}
 assert.equal(steps,80);assert.ok(s.exportJob().undo.length<=20);
});
test("checkpoint round-trip and two-slot recovery preserve exact committed job",()=>{
 const s=new BenchbackState(),mem=new MemoryStore(),storage=new BenchbackStorage(mem,"test");
 assert.equal(storage.load().status,"empty");record(s,3);assert.equal(storage.save(s.exportJob()).ok,true);ok(s,"return");ok(s,"confirm",undefined,1);assert.equal(storage.save(s.exportJob()).ok,true);
 const loaded=new BenchbackStorage(mem,"test").load();assert.equal(loaded.status,"ready");assert.deepEqual(loaded.job,s.exportJob());
 mem.values.set("test.1","{damaged");const recovered=new BenchbackStorage(mem,"test").load();assert.equal(recovered.status,"recovered");assert.equal(recovered.job.current.groups[0].returned,0);
});
test("storage errors/readback mismatch never claim Saved and keep latest valid checkpoint",()=>{
 const s=new BenchbackState(),mem=new MemoryStore(),storage=new BenchbackStorage(mem,"fault");
 record(s);assert.equal(storage.save(s.exportJob()).ok,true);const first=s.exportJob();ok(s,"return");mem.fail=true;assert.equal(storage.save(s.exportJob()).ok,false);
 assert.deepEqual(new BenchbackStorage(mem,"fault").load().job,first);mem.fail=false;mem.mismatch=true;assert.equal(storage.save(s.exportJob()).ok,false);assert.deepEqual(new BenchbackStorage(mem,"fault").load().job,first);
});
test("malformed, oversized, duplicate IDs, false completion and unsupported data are rejected",()=>{
 const mem=new MemoryStore();mem.values.set("bad.0","x".repeat(512001));assert.equal(new BenchbackStorage(mem,"bad").load().status,"blocked");
 const s=new BenchbackState();record(s);const original=s.exportJob();
 for(const mutate of [
  d=>d.current.groups.push(d.current.groups[0]),
  d=>d.current.groups[0].quantity=0,
  d=>d.current.groups[0].source.x=Infinity,
  d=>d.current.phase="complete",
  d=>d.undo=Array(21).fill(d.current),
  d=>d.current.activeId=234
 ]){const d=structuredClone(original);mutate(d);assert.throws(()=>validateSavedJob(d));}
 mem.values.set("version.0",JSON.stringify({version:2,sequence:1,payload:"{}",checksum:"0"}));assert.equal(new BenchbackStorage(mem,"version").load().status,"blocked");
});

test("reset then undo cannot bypass resume alignment",()=>{
 const original=new BenchbackState();record(original,2);ok(original,"return");
 const restored=new BenchbackState(original.exportJob());ok(restored,"reset",true);ok(restored,"undo");
 assert.equal(restored.aligned,false);assert.equal(act(restored,"confirm",undefined,1).ok,false);
 ok(restored,"align");ok(restored,"confirm",undefined,1);
});
test("record more preserves return counts after long progress and supports another group",()=>{
 const s=new BenchbackState();record(s,30);ok(s,"return");for(let j=0;j<25;j++)ok(s,"confirm",undefined,1);
 ok(s,"recordMore");assert.equal(s.view.ledger.groups[0].returned,25);record(s,2,5);ok(s,"return");assert.equal(s.view.outstanding,7);assert.equal(s.view.ledger.activeId,2);
});

test("fresh storage adapters load prior sequence before save",()=>{
 const s=new BenchbackState(),mem=new MemoryStore(),first=new BenchbackStorage(mem,"fresh");
 record(s);assert.equal(first.save(s.exportJob()).ok,true);ok(s,"return");assert.equal(first.save(s.exportJob()).ok,true);
 ok(s,"confirm",undefined,1);assert.equal(new BenchbackStorage(mem,"fresh").save(s.exportJob()).ok,true);
 assert.deepEqual(new BenchbackStorage(mem,"fresh").load().job,s.exportJob());
});
test("explicit new job after transient read failure cannot resurrect old higher-sequence data",()=>{
 const s=new BenchbackState(),mem=new MemoryStore(),first=new BenchbackStorage(mem,"replace");
 record(s);assert.equal(first.save(s.exportJob()).ok,true);ok(s,"return");assert.equal(first.save(s.exportJob()).ok,true);
 const originalRead=mem.getString.bind(mem);let failures=2;
 mem.getString=k=>{if(failures-->0)throw new Error("transient read failure");return originalRead(k);};
 const next=new BenchbackStorage(mem,"replace");assert.equal(next.load().status,"blocked");
 const empty=new BenchbackState().exportJob();assert.equal(next.save(empty).ok,false);assert.equal(next.save(empty,true).ok,true);
 const reopened=new BenchbackStorage(mem,"replace").load();assert.equal(reopened.status,"ready");assert.equal(reopened.job.current.groups.length,0);
});
