import {ICharacter} from 'storyScript/Interfaces/storyScript';
import {IItem} from './types';

export class Character implements ICharacter {
    name: string = '';
    hitpoints: number = 10;
    currentHitpoints: number;

    // Add character properties here.

    items: IItem[] = [];

    equipment: {};

    constructor() {
        this.equipment = {}
    }
}