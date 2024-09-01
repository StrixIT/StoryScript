import {ICharacter} from 'storyScript/Interfaces/storyScript';
import {IEquipment, IItem} from './types';

export class Character implements ICharacter {
    name: string = '';
    level?: number = 1;
    hitpoints: number = 10;
    currentHitpoints: number;

    // Add character properties here.
    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;

    items: IItem[] = [];

    equipment: IEquipment = {};

    constructor() {
        this.equipment = {
            // Remove the slots you don't want to use. Omit them in your IEquipment interface too!
            head: null,
            body: null,
            leftHand: null,
            rightHand: null,
            feet: null
            // Add your custom slots here. Make sure you add them in your IEquipment interface too.
        }
    }
}