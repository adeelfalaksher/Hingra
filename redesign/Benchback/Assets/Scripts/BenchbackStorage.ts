// Owns bounded versioned two-slot checkpoints; never treats saved coordinates as an anchor.
import {validateSavedJob} from "./BenchbackTypes";
import type {SavedJob} from "./BenchbackTypes";
export interface StringStore {getString(key:string):string;putString(key:string,value:string):void;}
export type LoadResult={status:"empty"|"ready"|"recovered"|"blocked";job:SavedJob|null;message:string};
type Checkpoint={version:number;sequence:number;payload:string;checksum:string};
const MAX_BYTES=512000;
function checksum(text:string):string{let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
export class BenchbackStorage {
  private sequence=0;
  private newestSlot=-1;
  private initialized=false;
  private blocked=false;
  private store:StringStore;
  private namespace:string;
  constructor(store:StringStore,namespace="benchback.job.v1"){this.store=store;this.namespace=namespace;}
  private key(slot:number){return this.namespace+"."+slot;}
  private decode(raw:string):{sequence:number;job:SavedJob}{
    if(raw.length>MAX_BYTES)throw new Error("Checkpoint is too large");
    const c=JSON.parse(raw) as Checkpoint;
    if(!c || c.version!==1 || !Number.isSafeInteger(c.sequence) || c.sequence<1 || typeof c.payload!=="string" || c.payload.length>MAX_BYTES || c.checksum!==checksum(c.payload))throw new Error("Unsupported or damaged checkpoint");
    return{sequence:c.sequence,job:validateSavedJob(JSON.parse(c.payload))};
  }
  load():LoadResult{
    this.initialized=true;
    const valid:{sequence:number;job:SavedJob;slot:number}[]=[];
    let present=false,invalid=false;
    for(let slot=0;slot<2;slot++){
      try{const raw=this.store.getString(this.key(slot));if(!raw)continue;present=true;const c=this.decode(raw);valid.push({...c,slot});}catch(e){invalid=true;}
    }
    valid.sort((a,b)=>b.sequence-a.sequence);
    if(!valid.length){this.blocked=present||invalid;return{status:this.blocked?"blocked":"empty",job:null,message:this.blocked?"Saved data could not be read. Confirm a new job only if you want to replace it.":"No saved job"};}
    this.blocked=false;
    const newest=valid[0];this.sequence=newest.sequence;this.newestSlot=newest.slot;
    return{status:invalid?"recovered":"ready",job:newest.job,message:invalid?"Recovered previous checkpoint. Some recent changes may be missing.":"Saved job found"};
  }
  save(job:SavedJob,replaceUnreadable=false):{ok:boolean;message:string}{
    if(!this.initialized)this.load();
    if(this.blocked&&!replaceUnreadable)return{ok:false,message:"Unreadable saved data kept. Confirm a new job to replace it."};
    try{
      const safe=validateSavedJob(job),payload=JSON.stringify(safe);
      if(replaceUnreadable && this.blocked){
        for(let slot=0;slot<2;slot++){this.store.putString(this.key(slot),"");if(this.store.getString(this.key(slot))!=="")throw new Error("Could not replace unreadable checkpoints");}
        this.sequence=0;this.newestSlot=-1;
      }
      const sequence=this.sequence+1;
      if(!Number.isSafeInteger(sequence)||payload.length>MAX_BYTES)throw new Error("Job storage limit reached");
      const text=JSON.stringify({version:1,sequence,payload,checksum:checksum(payload)});
      if(text.length>MAX_BYTES)throw new Error("Job storage limit reached");
      const slot=this.newestSlot===0?1:0;
      this.store.putString(this.key(slot),text);
      const readback=this.store.getString(this.key(slot));if(readback!==text)throw new Error("Checkpoint readback failed");
      this.decode(readback);this.sequence=sequence;this.newestSlot=slot;this.blocked=false;
      return{ok:true,message:"Saved locally"};
    }catch(e){return{ok:false,message:"Save failed. Progress may not survive closing. "+(e instanceof Error?e.message:String(e))};}
  }
}
