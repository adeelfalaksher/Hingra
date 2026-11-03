/** Passive UIKit lesson panel. Owns presentation and emits intent; never scores or moves anatomy. */
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import {FlexAlign, FlexAlignSelf, FlexDirection, FlexJustify} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";
import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate";
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import {Slider} from "SpectaclesUIKit.lspkg/Scripts/Components/Slider/Slider";
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event";
import {LessonView} from "./HingraState";

type TextRole = "Title2" | "Body" | "Caption" | "Button";
const TYPE_SCALE: Record<TextRole, {size:number;weight:number}> = {
  Title2:{size:93,weight:700}, Body:{size:39,weight:500},
  Caption:{size:38,weight:500}, Button:{size:39,weight:500}
};
function applyTextRole(t:Text, role:TextRole, scale:number):void {
  t.size=TYPE_SCALE[role].size*scale;
  (t as Text & {weight?:number}).weight=TYPE_SCALE[role].weight;
}
@component
export class HingraLessonUI extends BaseScriptComponent {
  @ui.label("Hingra — lesson panel")
  @ui.separator
  @ui.group_start("Settings")
  @input @hint("Panel title.") title:string="HINGRA";
  @input @hint("Panel width in centimetres.") @widget(new SliderWidget(20,28,1)) panelWidth:number=23;
  @input @hint("Scale the shared type hierarchy.") @widget(new SliderWidget(0.9,1.2,0.05)) textScale:number=1;
  @input @hint("Gap between layout rows, in centimetres.") @widget(new SliderWidget(0.5,1.2,0.1)) rowGap:number=0.7;
  @input("vec4","{1,1,1,1}") @hint("Primary text colour.") @widget(new ColorWidget()) textColor:vec4;
  @input("vec4","{0.45,0.9,0.82,1}") @hint("Progress and emphasis colour.") @widget(new ColorWidget()) accentColor:vec4;
  @ui.group_end
  private actionEvent=new Event<void>();
  private flexionEvent=new Event<number>();
  get onAction():PublicApi<void>{return this.actionEvent.publicApi();}
  get onFlexion():PublicApi<number>{return this.flexionEvent.publicApi();}
  private view:LessonView|null=null;
  private progress!:Text;
  private prompt!:Text;
  private feedback!:Text;
  private legend!:Text;
  private angle!:Text;
  private actionLabel!:Text;
  private slider!:Slider;
  private sliderObject!:SceneObject;
  private sliderReady=false;
  private updating=false;

  onAwake():void {this.build();}
  setView(view:LessonView):void {this.view=view;this.render();}
  private build():void {
    this.sceneObject.createComponent("Component.Canvas");
    const plate=this.sceneObject.createComponent(BackPlate.getTypeName()) as BackPlate;
    plate.style="dark";
    const content=this.obj(this.sceneObject,"HingraContent",new vec3(0,0,0.6));
    const flex=content.createComponent(FlexLayout.getTypeName()) as FlexLayout;
    flex.autoDiscoverItemsOnStart=false;
    flex.width=this.panelWidth;flex.height=-1;
    flex.direction=FlexDirection.Column;flex.alignItems=FlexAlign.Stretch;
    flex.justifyContent=FlexJustify.Start;flex.rowGap=this.rowGap;
    flex.paddingTop=1.4;flex.paddingBottom=1.4;flex.paddingLeft=1.4;flex.paddingRight=1.4;
    flex.onLayoutComplete.add(r=>plate.size=new vec2(r.containerWidth,r.containerHeight));
    this.textRow(content,"HingraTitle",this.title,"Title2",3.2);
    this.textRow(content,"HingraSubtitle","ELBOW / SPATIAL LESSON","Caption",1.4);
    this.progress=this.textRow(content,"HingraProgress","ASSEMBLE  0 / 3","Caption",1.8);
    this.progress.textFill.color=this.accentColor;
    this.prompt=this.textRow(content,"HingraPrompt","Select the upper arm bone.","Body",4.4);
    this.legend=this.textRow(content,"HingraLegend","Amber: Humerus\nTeal: Ulna\nCoral: Radius","Caption",3.7);
    this.feedback=this.textRow(content,"HingraFeedback","Choose directly on the model.","Caption",4.1);
    this.angle=this.textRow(content,"HingraAngle","Movement unlocks after assembly","Caption",1.7);
    this.flexChild(content,{w:this.panelWidth-2.8,h:4.2},row=>{
      this.sliderObject=this.obj(row,"HingraFlexionSlider");
      this.slider=this.sliderObject.createComponent(Slider.getTypeName()) as Slider;
      this.slider.size=new vec3(this.panelWidth-3.5,3.2,1);
      this.slider.currentValue=0;this.slider.knobSize=new vec2(3.2,3.2);
      this.slider.onValueChange.add(value=>{
        if(!this.updating)this.flexionEvent.invoke(value*120);
      });
      this.slider.onInitialized.add(()=>{this.sliderReady=true;this.render();});
    });
    this.flexChild(content,{w:this.panelWidth-2.8,h:4.6},row=>{
      row.name="HingraPrimaryAction";
      const button=row.createComponent(Button.getTypeName()) as Button;
      button.setVariant({theme:"SnapOS2",shape:"Rectangle",style:"Primary"});
      button.size=new vec3(this.panelWidth-2.8,4.6,1);
      button.onInitialized.add(()=>button.size=new vec3(this.panelWidth-2.8,4.6,1));
      const label=this.obj(row,"HingraActionLabel",new vec3(0,0,0.68));
      this.actionLabel=this.makeText(label,"Restart","Button",this.panelWidth-3.5,2);
      button.onTriggerUp.add(()=>this.actionEvent.invoke());
    });
    this.textRow(content,"HingraModelNote","Simplified movement • teaching model","Caption",1.6);
    this.render();
  }
  private render():void {
    if(!this.view||!this.progress)return;
    const view=this.view;
    this.progress.text=view.progress;this.prompt.text=view.prompt;
    this.feedback.text=view.feedback;this.actionLabel.text=view.action;
    const recall=view.phase==="recall"||view.phase==="complete";
    this.legend.text=recall?"Labels and colour cues hidden\nIdentify the bone by its shape."
      :"Amber: Humerus\nTeal: Ulna\nCoral: Radius";
    this.angle.text=view.phase==="explore"?"Flexion  "+Math.round(view.flexion)+"°"
      :recall?"First-try score  "+view.score+" / 3":"Movement unlocks after assembly";
    if(this.sliderReady)this.sliderObject.enabled=view.phase==="explore";
    this.updating=true;this.slider.currentValue=view.flexion/120;this.updating=false;
  }
  private obj(parent:SceneObject,name:string,position?:vec3):SceneObject {
    const sceneObject=global.scene.createSceneObject(name);sceneObject.setParent(parent);
    if(position)sceneObject.getTransform().setLocalPosition(position);
    return sceneObject;
  }
  private flexChild(parent:SceneObject,size:{w?:number;h?:number;grow?:number},
      builder:(childObject:SceneObject)=>void):SceneObject {
    const child=this.obj(parent,"Item");
    child.getTransform().setLocalPosition(new vec3(0,0,0.04));
    const item=child.createComponent(FlexItem.getTypeName()) as FlexItem;
    if(size.w!==undefined&&size.w>0)item.overrideWidth=size.w;
    if(size.h!==undefined&&size.h>0)item.overrideHeight=size.h;
    item.flexGrow=size.grow??0;item.flexShrink=0;item.alignSelf=FlexAlignSelf.Stretch;
    builder(child);
    const layout=parent.getComponent(FlexLayout.getTypeName()) as FlexLayout|null;
    if(layout)layout.addItems([item]);
    return child;
  }
  private makeText(so:SceneObject,value:string,role:TextRole,width:number,height:number):Text {
    const text=so.createComponent("Component.Text") as Text;
    text.text=value;text.depthTest=true;applyTextRole(text,role,this.textScale);
    text.textFill.color=this.textColor;
    text.horizontalAlignment=HorizontalAlignment.Left;
    text.verticalAlignment=VerticalAlignment.Center;
    text.horizontalOverflow=HorizontalOverflow.Wrap;
    text.verticalOverflow=VerticalOverflow.Overflow;
    text.layoutRect=Rect.create(-width/2,width/2,-height/2,height/2);
    return text;
  }
  private textRow(parent:SceneObject,name:string,value:string,role:TextRole,height:number):Text {
    let result!:Text;
    this.flexChild(parent,{w:this.panelWidth-2.8,h:height},row=>{
      row.name=name;result=this.makeText(row,value,role,this.panelWidth-2.8,height);
    });
    return result;
  }
}
