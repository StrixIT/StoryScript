import { ICharacter, ICollection } from 'storyScript/Interfaces/storyScript';
import { IItem } from './types';
import { ClassType } from './classType';
import { CharacterClass } from './characterClass';

export class Character implements ICharacter {
    name: string = '';
    portraitFileName?: string = '';
    hitpoints: number = 0;
    currentHitpoints: number = 0;
    score: number = 0;
    currency?: number = 3;

    class?: CharacterClass;

    items: ICollection<IItem> = [];

    frozen?: boolean;
    frightened?: boolean;
    confused?: boolean;

    equipment: {
        body?: IItem,
        leftHand?: IItem,
        rightHand?: IItem,
        amulet?: IItem,
        rightRing?: IItem
    };

    constructor() {
        this.equipment = {
            body: null,
            leftHand: null,
            amulet: null,
            rightRing: null
        }
    }
}