/** LEAF helpers: read public state and drive real SIK controls. No direct state mutation. */
import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import {findInteractableByName} from "Leaf.lspkg/Interactors/InteractableUtils";
import {findSceneObjectByName,sleep} from "Leaf.lspkg/Utils/common/Utils";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {HingraMain} from "./HingraMain";
export class HingraLeafHelpers extends DefaultLeafInteractor {
 object(name:string):SceneObject {
  const object=findSceneObjectByName(name);
  if(!object)throw new Error("Scene object missing: "+name);
  return object;
 }
 get main():HingraMain {
  const component=this.object("HingraController").getComponent(HingraMain.getTypeName()) as HingraMain;
  if(!component)throw new Error("HingraMain is missing.");
  return component;
 }
 text(name:string):string {
  const text=this.object(name).getComponent("Component.Text") as Text;
  if(!text)throw new Error("Text component missing: "+name);
  return text.text;
 }
 target(name:string){
  const target=findInteractableByName(name,undefined,true);
  if(!target)throw new Error("Enabled SIK target missing: "+name);
  return target;
 }
 async tap(name:string):Promise<void>{
  await this.trigger(this.target(name));await sleep(550);
 }
 async fresh():Promise<void>{
  await sleep(3000);
  if(this.main.phase==="explore")await this.tap("HingraPrimaryAction");
  await this.tap("HingraPrimaryAction");
  expect(this.main.phase).toBe("assemble");
  expect(this.main.placedCount).toBe(0);
 }
 async assemble():Promise<void>{
  await this.fresh();
  await this.tap("HingraHumerus");await this.tap("HingraUlna");await this.tap("HingraRadius");
  expect(this.main.phase).toBe("explore");
 }
 firstVisual(object:SceneObject):RenderMeshVisual {
  const visual=object.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
  if(visual)return visual;
  for(let i=0;i<object.getChildrenCount();i++){
   try{return this.firstVisual(object.getChild(i));}catch{}
  }
  throw new Error("No mesh below "+object.name);
 }
}
