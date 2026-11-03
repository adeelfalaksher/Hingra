import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {HingraLeafHelpers} from "./HingraLeafHelpers";
@component
export class HingraRestartScenario extends Scenario {
 async run():Promise<void>{
  const h=new HingraLeafHelpers();await h.assemble();
  await h.tap("HingraPrimaryAction");await h.tap("HingraRadius");
  const score=h.main.recallScore;
  expect(score).toBeGreaterThan(0);
  await h.tap("HingraPrimaryAction");
  expect(h.main.phase).toBe("assemble");
  expect(h.main.placedCount).toBe(0);
  expect(h.main.recallScore).toBe(score-1);
  expect(h.main.flexionDegrees).toBe(0);
  expect(h.text("HingraLegend").includes("Amber")).toBe(true);
  expect(h.object("HingraFlexionSlider").enabled).toBe(false);
 }
}
