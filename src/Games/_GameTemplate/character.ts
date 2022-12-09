import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { IItem, IEquipment } from './types';

export class Character implements ICharacter {
    name: string = '';
    score: number = 0;
    hitpoints: number = 10;
    currentHitpoints: number = 10;
    currency: number = 0;

    // Add character properties here.

    items: ICollection<IItem> = [];

    equipment: {};

    constructor() {
        this.equipment = <IEquipment>{
            // Remove the slots you don't want to use
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