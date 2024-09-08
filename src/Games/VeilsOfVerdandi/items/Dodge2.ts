import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Dodge2.html?raw';
import {customEntity} from "storyScript/EntityCreatorFunctions.ts";
import {PowerAttack1} from "./PowerAttack1.ts";
import {Dodge1} from "./Dodge1.ts";

export function Dodge2() {
	return customEntity(Dodge1, { name: 'Dodge 2', power: '1', description: description });
}