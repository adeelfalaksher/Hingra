import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario";
import {expect} from "Leaf.lspkg/Utils/common/Expect";
import {sleep} from "Leaf.lspkg/Utils/common/Utils";
import {createIKInteractor} from "Leaf.lspkg/Interactors/interactor/ik/visualizer/BitmojiAvatar";
import {HingraLeafHelpers} from "./HingraLeafHelpers";
@component
export class HingraIKScenario extends Scenario {
 async run():Promise<void>{
  const h=new HingraLeafHelpers();await h.fresh();await h.tap("HingraHumerus");
  const before=h.main.placedCount;
  const target=h.target("HingraPrimaryAction");
  // An explicit undefined overrides the factory's default simulated-input fallback.
  const ik=createIKInteractor({body:{fallback:undefined}});
  console.log("[Hingra IK] route="+(ik.right.isIndirect(target)?"far-field":"direct"));
  await ik.trigger(target);await sleep(700);
  expect(h.main.placedCount).toBe(before-1);
  expect(h.main.phase).toBe("assemble");
 }
}
