
import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { IItem } from './types';

export class Character implements ICharacter {
    name: string = '';
    score: number = 0;
    hitpoints: number = 10;
    currentHitpoints: number = 10;
    currency: number = 0;

    // Add character properties here.

    items: ICollection<IItem> = [];

    equipment: {
        // Remove the slots you don't want to use
        head: IItem,
        amulet: IItem,
        body: IItem,
        hands: IItem,
        leftHand: IItem,
        leftRing: IItem,
        rightHand: IItem,
        rightRing: IItem,
        legs: IItem,
        feet: IItem
    };

    constructor() {
        this.equipment = {
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
        }
    }
}