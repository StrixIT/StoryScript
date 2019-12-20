import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { IItem } from './types';

export class Character implements ICharacter {
    name: string = '';
    score: number = 0;
    currency: number = 0;
    level?: number = 1;
    hitpoints: number = 10;
    currentHitpoints: number = 10;

    // Add character properties here.
    strength?: number = 1;
    agility?: number = 1;
    intelligence?: number = 1;

    items: ICollection<IItem> = [];

    equipment: {
        head?: IItem,
        body?: IItem,
        leftHand?: IItem,
        rightHand?: IItem,
        feet?: IItem,
    };

    constructor() {
        this.equipment = {
            head: null,
            body: null,
            leftHand: null,
            rightHand: null,
            feet: null
        }
    }
}