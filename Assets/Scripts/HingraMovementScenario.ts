import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {sleep} from "Leaf.lspkg/Utils/common/Utils";
import {HingraLeafHelpers} from "./HingraLeafHelpers";
@component
export class HingraMovementScenario extends Scenario {
 async run():Promise<void>{
  const h=new HingraLeafHelpers();await h.assemble();
  const humerus=h.object("HingraHumerus").getTransform();
  const beforePosition=humerus.getLocalPosition();
  const beforeAngle=h.main.flexionDegrees;
  await h.drag(h.target("HingraFlexionSlider"),new vec3(0.3,0,0),800);
  await sleep(600);
  expect(h.main.flexionDegrees).toBeGreaterThan(beforeAngle);
  expect(Math.abs(h.object("HingraForearm").getTransform().getLocalRotation().x)).toBeGreaterThan(0.001);
  expect(humerus.getLocalPosition().distance(beforePosition)).toBeCloseTo(0,2);
  expect(h.text("HingraAngle").includes("Flexion")).toBe(true);
 }
}
