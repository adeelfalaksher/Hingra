import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator";
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata";
import {HingraAssemblyScenario} from "./HingraAssemblyScenario";
import {HingraMovementScenario} from "./HingraMovementScenario";
import {HingraRecallScenario} from "./HingraRecallScenario";
import {HingraRestartScenario} from "./HingraRestartScenario";
import {HingraIKScenario} from "./HingraIKScenario";
@component
export class HingraLeafIndex extends BaseScriptComponent {
 @scenariosIndex
 static scenariosIndex:ScenarioMetadata[]=[
  {id:"hingra-assembly",typename:HingraAssemblyScenario.getTypeName(),parameters:{__leaf__timeout_secs:"60"}},
  {id:"hingra-movement",typename:HingraMovementScenario.getTypeName(),parameters:{__leaf__timeout_secs:"60"}},
  {id:"hingra-recall",typename:HingraRecallScenario.getTypeName(),parameters:{__leaf__timeout_secs:"60"}},
  {id:"hingra-restart",typename:HingraRestartScenario.getTypeName(),parameters:{__leaf__timeout_secs:"60"}},
  {id:"hingra-ik-input",typename:HingraIKScenario.getTypeName(),parameters:{__leaf__timeout_secs:"90"}},
 ];
}
