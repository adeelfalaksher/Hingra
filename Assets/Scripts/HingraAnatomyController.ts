/** Owns source anatomy presentation, SIK selection and simplified articulation.
 * References: three centred mesh wrappers, forearm pivot, shared bone material.
 * Never creates UI or scores answers. Bone offsets come from the source manifest.
 */
import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event";
import {BoneName,LessonView} from "./HingraState";
import {HINGRA_BONES} from "./HingraSceneContracts";
type BoneView={name:BoneName;root:SceneObject;assembled:vec3;target:vec3;materials:Material[];hovered:boolean;column:number;recallColumn:number};
@component
export class HingraAnatomyController extends BaseScriptComponent {
 @ui.label("Hingra — anatomy and selection")
 @ui.separator
 @ui.group_start("References")
 @input @hint("Centred humerus mesh wrapper.") humerus!:SceneObject;
 @input @hint("Centred ulna mesh wrapper.") ulna!:SceneObject;
 @input @hint("Centred radius mesh wrapper.") radius!:SceneObject;
 @input @hint("Shared forearm pivot at the approximate elbow centre.") forearm!:SceneObject;
 @input @hint("Base bone material, cloned for each visual.") boneMaterial!:Material;
 @ui.group_end
 @ui.group_start("Settings")
 @input("vec4","{1,0.72,0.25,1}") @hint("Humerus teaching colour.") @widget(new ColorWidget()) humerusColor:vec4;
 @input("vec4","{0.3,0.88,0.78,1}") @hint("Ulna teaching colour.") @widget(new ColorWidget()) ulnaColor:vec4;
 @input("vec4","{1,0.5,0.42,1}") @hint("Radius teaching colour.") @widget(new ColorWidget()) radiusColor:vec4;
 @input @hint("Assembly transition time in seconds.") @widget(new SliderWidget(0.1,1,0.05)) transitionSeconds:number=0.4;
 @input @hint("Draw selection volumes when diagnosing hit targets.") debugColliders:boolean=false;
 @ui.group_end
 private selectEvent=new Event<BoneName>();
 get onSelect():PublicApi<BoneName>{return this.selectEvent.publicApi();}
 private bones:BoneView[]=[];
 private view:LessonView|null=null;
 private ready=false;
 onAwake():void {
  this.createEvent("OnStartEvent").bind(()=>this.initialize());
  this.createEvent("UpdateEvent").bind(()=>this.update());
 }
 setView(view:LessonView):void {this.view=view;if(this.ready)this.applyView();}
 private initialize():void {
  if(!this.humerus||!this.ulna||!this.radius||!this.forearm||!this.boneMaterial)
   throw new Error("Hingra anatomy references are incomplete.");
  const roots=[this.humerus,this.ulna,this.radius];
  HINGRA_BONES.forEach((data,index)=>{
   const root=roots[index];
   const collider=root.createComponent("Physics.ColliderComponent") as ColliderComponent;
   const shape=Shape.createBoxShape();
   shape.size=new vec3(Math.max(4,data.bounds[0]+0.5),data.bounds[1]+0.5,Math.max(4,data.bounds[2]+0.5));
   collider.shape=shape;collider.intangible=true;collider.debugDrawEnabled=this.debugColliders;
   const interactable=root.createComponent(Interactable.getTypeName()) as Interactable;
   interactable.colliders=[collider];
   const bone:BoneView={name:data.name,root,assembled:root.getTransform().getLocalPosition(),
    target:root.getTransform().getLocalPosition(),materials:[],hovered:false,
    column:data.column,recallColumn:data.recallColumn};
   this.cloneVisualMaterials(root,bone.materials);
   if(bone.materials.length===0)throw new Error("No mesh visual found for "+data.name);
   interactable.onTriggerEnd.add(()=>this.selectEvent.invoke(data.name));
   interactable.onHoverEnter.add(()=>{bone.hovered=true;this.tint(bone);});
   interactable.onHoverExit.add(()=>{bone.hovered=false;this.tint(bone);});
   this.bones.push(bone);
  });
  this.ready=true;
  this.applyView();
  this.bones.forEach(b=>b.root.getTransform().setLocalPosition(b.target));
  console.log("[Hingra] Three source anatomy meshes and SIK targets ready.");
 }
 private cloneVisualMaterials(root:SceneObject,materials:Material[]):void {
  const visuals=root.getComponents("Component.RenderMeshVisual") as RenderMeshVisual[];
  visuals.forEach(visual=>{
   const material=this.boneMaterial.clone();
   visual.clearMaterials();visual.addMaterial(material);materials.push(material);
  });
  for(let i=0;i<root.getChildrenCount();i++)this.cloneVisualMaterials(root.getChild(i),materials);
 }
 private applyView():void {
  if(!this.view)return;
  const recall=this.view.phase==="recall"||this.view.phase==="complete";
  this.bones.forEach((bone,index)=>{
   const assembled=!recall&&(this.view!.phase==="explore"||this.view!.placed.indexOf(bone.name)>=0);
   const parentLift=index===0?0:5;
   bone.target=assembled?bone.assembled:new vec3(recall?bone.recallColumn:bone.column,(recall?0:-6)-parentLift,0);
   this.tint(bone);
  });
  const angle=this.view.phase==="explore"?this.view.flexion:0;
  this.forearm.getTransform().setLocalRotation(quat.angleAxis(-angle*Math.PI/180,new vec3(1,0,0)));
 }
 private tint(bone:BoneView):void {
  const recall=this.view&&(this.view.phase==="recall"||this.view.phase==="complete");
  let color=recall?new vec4(0.94,0.9,0.79,1):bone.name==="Humerus"?this.humerusColor:bone.name==="Ulna"?this.ulnaColor:this.radiusColor;
  if(bone.hovered)color=new vec4(Math.min(1,color.x*1.15+0.1),Math.min(1,color.y*1.15+0.1),Math.min(1,color.z*1.15+0.1),1);
  bone.materials.forEach(material=>material.mainPass.baseColor=color);
 }
 private update():void {
  if(!this.ready)return;
  const amount=Math.min(1,getDeltaTime()*6/Math.max(0.1,this.transitionSeconds));
  this.bones.forEach(bone=>{
   const transform=bone.root.getTransform();
   const current=transform.getLocalPosition();
   transform.setLocalPosition(vec3.lerp(current,bone.target,amount));
  });
 }
}
