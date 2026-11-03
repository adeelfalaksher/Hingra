/** Stable authored object names and source-derived bone dimensions. No lesson state. */
import {BoneName} from "./HingraState";
export const HINGRA_BONES: {name:BoneName; bounds:[number,number,number]; column:number; recallColumn:number}[] = [
 {name:"Humerus",bounds:[5.541305,16.9037,2.7048945],column:-7,recallColumn:0},
 {name:"Ulna",bounds:[2.76639,13.600235,4.328214],column:0,recallColumn:7},
 {name:"Radius",bounds:[3.28361,12.606825,3.619297],column:7,recallColumn:-7}
];
export const HINGRA_OBJECTS = {
 root:"HingraExperience", model:"HingraAnatomy", forearm:"HingraForearm",
 humerus:"HingraHumerus", ulna:"HingraUlna", radius:"HingraRadius",
 ui:"HingraLessonPanel", controller:"HingraController"
};
