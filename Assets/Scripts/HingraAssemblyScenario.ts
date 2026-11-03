import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {HingraLeafHelpers} from "./HingraLeafHelpers";
@component
export class HingraAssemblyScenario extends Scenario {
 async run():Promise<void>{
  const h=new HingraLeafHelpers();await h.fresh();
  expect(h.text("HingraPrompt")).toBe("Select the upper arm bone.");
  const count=h.main.placedCount;
  await h.tap("HingraRadius");
  expect(h.main.placedCount).toBe(count);
  expect(h.text("HingraFeedback").includes("Try another")).toBe(true);
  const startY=h.object("HingraHumerus").getTransform().getLocalPosition().y;
  await h.tap("HingraHumerus");
  expect(h.main.placedCount).toBe(count+1);
  expect(h.object("HingraHumerus").getTransform().getLocalPosition().y).toBeGreaterThan(startY+5);
  await h.tap("HingraUlna");await h.tap("HingraRadius");
  expect(h.main.placedCount).toBe(count+3);
  expect(h.main.phase).toBe("explore");
  expect(h.object("HingraFlexionSlider").enabled).toBe(true);
  expect(h.text("HingraActionLabel")).toBe("Test recall");
 }
}
