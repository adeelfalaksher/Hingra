import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {HingraLeafHelpers} from "./HingraLeafHelpers";
@component
export class HingraRecallScenario extends Scenario {
 async run():Promise<void>{
  const h=new HingraLeafHelpers();await h.assemble();
  await h.tap("HingraPrimaryAction");
  expect(h.main.phase).toBe("recall");
  expect(h.text("HingraLegend").includes("hidden")).toBe(true);
  const reference=h.firstVisual(h.object("HingraHumerus")).mainMaterial.mainPass.baseColor as vec4;
  for(const name of ["HingraUlna","HingraRadius"]){
   const color=h.firstVisual(h.object(name)).mainMaterial.mainPass.baseColor as vec4;
   expect(color.x).toBeCloseTo(reference.x,2);
   expect(color.y).toBeCloseTo(reference.y,2);
   expect(color.z).toBeCloseTo(reference.z,2);
  }
  const score=h.main.recallScore;
  await h.tap("HingraUlna");expect(h.main.recallScore).toBe(score);
  await h.tap("HingraRadius");expect(h.main.recallScore).toBe(score);
  await h.tap("HingraHumerus");await h.tap("HingraUlna");
  expect(h.main.phase).toBe("complete");
  expect(h.main.recallScore).toBe(score+2);
  expect(h.text("HingraFeedback").includes("2 of 3")).toBe(true);
 }
}
