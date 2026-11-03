/** Coordinates the lesson's single state owner, passive UI and anatomy controller.
 * Requires typed UI/anatomy component references. Does not author visible UI.
 */
import {HingraLessonUI} from "./HingraLessonUI";
import {HingraAnatomyController} from "./HingraAnatomyController";
import {HingraState,LessonView} from "./HingraState";
import {HingraAudioController} from "./HingraAudioController";
@component
export class HingraMain extends BaseScriptComponent {
 @ui.label("Hingra — lesson coordination")
 @ui.separator
 @ui.group_start("References")
 @input @hint("Passive lesson panel component.") lessonUI!:HingraLessonUI;
 @input @hint("Anatomy and SIK selection component.") anatomy!:HingraAnatomyController;
 @ui.group_end
 @ui.group_start("Settings")
 @input @hint("Quiet volume for action feedback.") @widget(new SliderWidget(0,0.5,0.05)) audioVolume:number=0.2;
 @ui.group_end
 private state=new HingraState();
 private audio!:HingraAudioController;
 onAwake():void {this.createEvent("OnStartEvent").bind(()=>this.startLesson());}
 get phase():string{return this.state.snapshot().phase;}
 get placedCount():number{return this.state.snapshot().placed.length;}
 get recallScore():number{return this.state.snapshot().score;}
 get flexionDegrees():number{return this.state.snapshot().flexion;}
 getLessonSnapshot():LessonView{return this.state.snapshot();}
 private startLesson():void {
  if(!this.lessonUI||!this.anatomy)throw new Error("Hingra Main requires typed UI and anatomy references.");
  this.audio=new HingraAudioController(this.sceneObject,this.audioVolume);
  this.anatomy.onSelect.add(bone=>{
   const before=this.phase;
   const correct=this.state.select(bone);
   if(correct&&before!==this.phase)this.audio.complete();else this.audio.select();
   this.publish();
  });
  this.lessonUI.onFlexion.add(value=>{this.state.setFlexion(value);this.publish();});
  this.lessonUI.onAction.add(()=>{
   if(this.phase==="explore")this.state.startRecall();else this.state.reset();
   this.audio.select();this.publish();
  });
  this.publish();
  console.log("[Hingra] Lesson ready: assemble, explore, recall.");
 }
 private publish():void {
  const view=this.state.snapshot();
  this.lessonUI.setView(view);this.anatomy.setView(view);
  console.log("[Hingra] phase="+view.phase+" placed="+view.placed.length+" score="+view.score+" flexion="+Math.round(view.flexion));
 }
}
