import description from './PowerAttack2.html?raw';
import {customEntity} from "storyScript/EntityCreatorFunctions.ts";
import {PowerAttack1} from "./PowerAttack1.ts";

export function PowerAttack2() {
    return customEntity(PowerAttack1, {name: 'Power Attack 2', power: '1d6', description: description, value: 40});
}