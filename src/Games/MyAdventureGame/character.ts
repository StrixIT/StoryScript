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
    };

    constructor() {
        this.equipment = {
        }
    }
}