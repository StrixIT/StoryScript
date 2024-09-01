import { ICharacter } from 'storyScript/Interfaces/storyScript';
import { IItem, IEquipment } from './types';

export class Character implements ICharacter {
    name: string = '';
    hitpoints: number = 10;
    currentHitpoints: number;

    // Add character properties here.

    items: IItem[] = [];

    equipment: IEquipment = {};

    constructor() {
        this.equipment = {
            // Remove the slots you don't want to use. Remove them from your IEquipment interface too!
            head: null,
            amulet: null,
            body: null,
            hands: null,
            leftHand: null,
            leftRing: null,
            rightHand: null,
            rightRing: null,
            legs: null,
            feet: null
            // Add your custom slots here. Make sure they are also present in your IEquipment interface.
        }
    }
}