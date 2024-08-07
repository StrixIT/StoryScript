import {ICharacter, ICollection} from 'storyScript/Interfaces/storyScript';
import {Class} from './interfaces/class';
import {Firebolt} from './items/firebolt';
import {Healingpotion} from './items/healingPotion';
import {Sword} from './items/sword';
import {Map} from './items/map';
import {IEquipment, IItem} from './types';
import {customEntity} from "storyScript/EntityCreatorFunctions.ts";

export class Character implements ICharacter {
    name: string = '';
    hitpoints: number = 10;
    currentHitpoints: number = 1000;

    // Add character properties here.
    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;
    class?: Class;
    level?: number = 1;

    items: ICollection<IItem> = [
        Healingpotion(),
        Firebolt(),
        Map()
    ];

    equipment: IEquipment;

    constructor() {
        this.equipment = {
            // Remove the slots you don't want to use
            head: null,
            amulet: null,
            body: null,
            hands: null,
            leftHand: null,
            leftRing: null,
            rightHand: Sword(),
            rightRing: null,
            legs: null,
            feet: null,
            spell: customEntity(Firebolt, {name: 'Special Bolt'})
        }
    }
}