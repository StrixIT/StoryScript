import {ICharacter} from 'storyScript/Interfaces/storyScript';
import {IItem} from './types';

export class Character implements ICharacter {
    name: string = '';
    hitpoints: number = 10;
    currentHitpoints: number = 10;

    // Add character properties here.

    items: IItem[] = [];

    equipment: {
        // Remove the slots you don't want to use
        head: IItem,
        body: IItem,
        hands: IItem,
        feet: IItem
    };

    constructor() {
        this.equipment = {
            // Remove the slots you don't want to use
            head: null,
            body: null,
            hands: null,
            feet: null
        }
    }
}