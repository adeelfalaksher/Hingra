/** Input-reactive audio only; no UI, scene layout or lesson decisions. */
const SELECT=requireAsset("../GeneratedSFX/HingraSelect.wav") as AudioTrackAsset;
const COMPLETE=requireAsset("../GeneratedSFX/HingraComplete.wav") as AudioTrackAsset;
export class HingraAudioController {
 private selectAudio:AudioComponent;
 private completeAudio:AudioComponent;
 constructor(parent:SceneObject,volume:number){
  this.selectAudio=this.create(parent,"HingraSelectAudio",SELECT,volume);
  this.completeAudio=this.create(parent,"HingraCompleteAudio",COMPLETE,volume);
 }
 private create(parent:SceneObject,name:string,track:AudioTrackAsset,volume:number):AudioComponent {
  const object=global.scene.createSceneObject(name);object.setParent(parent);
  const audio=object.createComponent("Component.AudioComponent") as AudioComponent;
  audio.audioTrack=track;audio.volume=volume;audio.playbackMode=Audio.PlaybackMode.LowLatency;
  return audio;
 }
 select():void{this.selectAudio.stop(false);this.selectAudio.play(1);}
 complete():void{this.completeAudio.stop(false);this.completeAudio.play(1);}
}
